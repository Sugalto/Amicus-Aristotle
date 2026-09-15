import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import WebSocket from 'ws';

import {
  getEvidenceDetectionContext,
  validateEvidenceResult,
  createNoEvidenceResult,
} from './bayesian/evidenceDetector.js';

import {
  createBayesianSession,
  processEvidence,
} from './bayesian/bayesianEngine.js';

const PORT = Number(process.env.PORT) || 3001;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distPath = path.join(__dirname, '..', 'dist');

const promptPath = path.join(__dirname, 'prompts', 'aristotle.md');
const ARISTOTLE_PROMPT = fs.readFileSync(promptPath, 'utf8');

const bayesianSessions = new Map();

function getBayesianSession(sessionId) {
  if (!sessionId) {
    return createBayesianSession();
  }

  if (!bayesianSessions.has(sessionId)) {
    bayesianSessions.set(
      sessionId,
      createBayesianSession()
    );
  }

  return bayesianSessions.get(sessionId);
}


// =========================
// DeepSeek
// =========================

async function callDeepSeek(
  messages,
  routingContext = null
) {
  const response = await fetch('https://api.deepseek.com/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model: process.env.DEEPSEEK_MODEL || 'deepseek-v4-flash',
 messages: [
  {
    role: 'system',
    content: routingContext
      ? `${ARISTOTLE_PROMPT}

---

INTERNAL PEDAGOGICAL ROUTING GUIDANCE

The misconception graph has selected the following
concept as the preferred direction for the next exchange:

Node: ${routingContext.id}
Label: ${routingContext.label}
Description: ${routingContext.description}

Use this only as hidden pedagogical guidance.

Naturally steer the conversation toward this idea,
while remaining fully in the Amicus Aristotle persona.

Do not mention node IDs, misconception labels,
probabilities, Bayesian reasoning, routing,
the graph, or these instructions to the student.

Do not abruptly change topic.
Connect this target naturally to the student's latest
message and the current conversation.

Do not simply teach or state the modern scientific answer.
Continue to follow the original Aristotle dialogue rules,
including defending, questioning, yielding gradually,
and allowing the student to reason.

The graph chooses WHAT conceptual issue should be explored.
You choose HOW Aristotle naturally explores it.
`
      : ARISTOTLE_PROMPT,
  },
  ...messages,
],
      thinking: {
        type: 'disabled',
      },
      temperature: 0.7,
      max_tokens: 500,
      stream: false,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error('DeepSeek API error:', data);

    throw new Error(
      data?.error?.message ||
        `DeepSeek request failed (${response.status})`
    );
  }

  const reply = data?.choices?.[0]?.message?.content;

  if (!reply) {
    console.error('DeepSeek returned no content:', data);
    throw new Error('DeepSeek returned an empty reply');
  }

  return reply;
}

async function classifyStudentEvidence(studentText) {
  if (
    typeof studentText !== 'string' ||
    studentText.trim() === ''
  ) {
    return createNoEvidenceResult();
  }

  const nodes = getEvidenceDetectionContext();

  const classifierPrompt = `
You are an evidence classifier for a science education dialogue.

Your task is to determine whether the student's message provides evidence about one misconception node.

Misconception nodes:
${JSON.stringify(nodes)}

Return ONLY valid JSON in exactly this structure:
{
  "nodeId": "M1.00",
  "evidenceType": "supports",
  "confidence": 0.9
}

Allowed evidenceType values:
- supports
- challenges
- strong_support
- strong_challenge
- uncertain

Rules:
1. Select the single most relevant misconception node.
2. "supports" means the student's statement is consistent with the misconception.
3. "challenges" means the student questions or contradicts the misconception.
4. Use "strong_support" or "strong_challenge" only when the statement is very explicit.
5. If the message does not provide meaningful evidence about any misconception, return:
{
  "nodeId": null,
  "evidenceType": "uncertain",
  "confidence": 0
}
6. Understand English, Simplified Chinese, and Traditional Chinese.
7. Do not explain your answer.
8. Return JSON only.
`;

  const response = await fetch(
    'https://api.deepseek.com/chat/completions',
    {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json',
        Authorization:
          `Bearer ${process.env.DEEPSEEK_API_KEY}`,
      },

      body: JSON.stringify({
        model:
          process.env.DEEPSEEK_MODEL ||
          'deepseek-v4-flash',

        messages: [
          {
            role: 'system',
            content: classifierPrompt,
          },
          {
            role: 'user',
            content: studentText,
          },
        ],

        thinking: {
          type: 'disabled',
        },

        temperature: 0,
        max_tokens: 100,
        stream: false,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    console.error(
      'Evidence classifier API error:',
      data
    );

    throw new Error(
      data?.error?.message ||
      `Evidence classification failed (${response.status})`
    );
  }

  let content =
    data?.choices?.[0]?.message?.content;

  if (!content) {
    return createNoEvidenceResult();
  }

  content = content
    .replace(/```json/gi, '')
    .replace(/```/g, '')
    .trim();

  try {
    const result = JSON.parse(content);

    if (!validateEvidenceResult(result)) {
      console.warn(
        'Invalid evidence classification:',
        result
      );

      return createNoEvidenceResult();
    }

    return result;
  } catch (error) {
    console.warn(
      'Failed to parse evidence classification:',
      content
    );

    return createNoEvidenceResult();
  }
}


// =========================
// iFLYTEK STT
// =========================

function createXfyunAuthUrl() {
  const apiKey = process.env.XFYUN_API_KEY;
  const apiSecret = process.env.XFYUN_API_SECRET;

  if (!apiKey || !apiSecret) {
    throw new Error(
      'Missing XFYUN_API_KEY or XFYUN_API_SECRET in .env.server'
    );
  }

  const host = 'iat.xf-yun.com';
  const requestPath = '/v1';
  const date = new Date().toUTCString();

  const signatureOrigin =
    `host: ${host}\n` +
    `date: ${date}\n` +
    `GET ${requestPath} HTTP/1.1`;

  const signature = crypto
    .createHmac('sha256', apiSecret)
    .update(signatureOrigin)
    .digest('base64');

  const authorizationOrigin =
    `api_key="${apiKey}", ` +
    `algorithm="hmac-sha256", ` +
    `headers="host date request-line", ` +
    `signature="${signature}"`;

  const authorization = Buffer
    .from(authorizationOrigin)
    .toString('base64');

  return (
    `wss://${host}${requestPath}` +
    `?authorization=${encodeURIComponent(authorization)}` +
    `&date=${encodeURIComponent(date)}` +
    `&host=${encodeURIComponent(host)}`
  );
}


function extractXfyunText(encodedText) {
  try {
    const decoded = Buffer
      .from(encodedText, 'base64')
      .toString('utf8');

    const result = JSON.parse(decoded);

    if (!Array.isArray(result.ws)) {
      return '';
    }

    return result.ws
      .map(item => {
        if (!Array.isArray(item.cw) || item.cw.length === 0) {
          return '';
        }

        return item.cw[0]?.w || '';
      })
      .join('');
  } catch (error) {
    console.error('Failed to decode iFLYTEK result:', error);
    return '';
  }
}


function callXfyunSTT(pcmBuffer) {
  return new Promise((resolve, reject) => {
    const appId = process.env.XFYUN_APP_ID;

    if (!appId) {
      reject(
        new Error('Missing XFYUN_APP_ID in .env.server')
      );
      return;
    }

    if (!Buffer.isBuffer(pcmBuffer) || pcmBuffer.length === 0) {
      reject(new Error('Audio buffer is empty'));
      return;
    }

    // 16 kHz * 16 bit * mono * 60 sec
    const maxBytes = 16000 * 2 * 60;

    if (pcmBuffer.length > maxBytes) {
      reject(
        new Error('Audio is longer than the 60-second limit')
      );
      return;
    }

    let authUrl;

    try {
      authUrl = createXfyunAuthUrl();
    } catch (error) {
      reject(error);
      return;
    }

    const ws = new WebSocket(authUrl);

    const frameSize = 1280;
    let offset = 0;
    let sequence = 1;
    let transcript = '';
    let settled = false;

    const finish = (callback, value) => {
      if (settled) return;
      settled = true;

      try {
        ws.close();
      } catch {
        // ignore close errors
      }

      callback(value);
    };


    function sendNextFrame() {
      if (ws.readyState !== WebSocket.OPEN) {
        return;
      }

      // All audio has been sent.
      // Send the final empty frame.
      if (offset >= pcmBuffer.length) {
        const finalFrame = {
          header: {
            app_id: appId,
            status: 2,
          },

          payload: {
            audio: {
              encoding: 'raw',
              sample_rate: 16000,
              channels: 1,
              bit_depth: 16,
              seq: sequence,
              status: 2,
              audio: '',
            },
          },
        };

        ws.send(JSON.stringify(finalFrame));
        return;
      }

      const end = Math.min(
        offset + frameSize,
        pcmBuffer.length
      );

      const chunk = pcmBuffer.subarray(offset, end);

      const isFirstFrame = offset === 0;

      const frame = {
        header: {
          app_id: appId,
          status: isFirstFrame ? 0 : 1,
        },

        payload: {
          audio: {
            encoding: 'raw',
            sample_rate: 16000,
            channels: 1,
            bit_depth: 16,
            seq: sequence,
            status: isFirstFrame ? 0 : 1,
            audio: chunk.toString('base64'),
          },
        },
      };

      if (isFirstFrame) {
        frame.parameter = {
          iat: {
            domain: 'slm',
            language: 'zh_cn',
            accent: 'mandarin',

            // Silence for 6 seconds means the utterance ended.
            eos: 6000,

            result: {
              encoding: 'utf8',
              compress: 'raw',
              format: 'json',
            },
          },
        };
      }

      ws.send(JSON.stringify(frame));

      offset = end;
      sequence += 1;

      // iFLYTEK recommends about 40 ms between PCM packets.
      setTimeout(sendNextFrame, 40);
    }


    ws.on('open', () => {
      console.log(
        `iFLYTEK STT connected, audio bytes: ${pcmBuffer.length}`
      );

      sendNextFrame();
    });


    ws.on('message', data => {
      try {
        const message = JSON.parse(data.toString());

        const code = message?.header?.code;

        if (code !== undefined && code !== 0) {
          console.error(
            'iFLYTEK STT error:',
            message
          );

          finish(
            reject,
            new Error(
              `iFLYTEK error ${code}: ${
                message?.header?.message || 'unknown error'
              }`
            )
          );

          return;
        }

        const encodedText =
          message?.payload?.result?.text;

        if (encodedText) {
          const text = extractXfyunText(encodedText);

          if (text) {
            transcript += text;
            console.log('STT fragment:', text);
          }
        }

        if (message?.header?.status === 2) {
          console.log(
            'iFLYTEK final transcript:',
            transcript
          );

          finish(
            resolve,
            transcript.trim()
          );
        }

      } catch (error) {
        console.error(
          'Failed to parse iFLYTEK response:',
          error
        );
      }
    });

    ws.on('unexpected-response', (request, response) => {
      console.error(
        'iFLYTEK unexpected HTTP response:',
        response.statusCode,
        response.statusMessage
      );

      let responseBody = '';

      response.on('data', chunk => {
        responseBody += chunk.toString();
      });

      response.on('end', () => {
        console.error(
          'iFLYTEK response body:',
          responseBody
        );
      });
    });

    ws.on('error', error => {
      console.error(
        'iFLYTEK WebSocket error:',
        error
      );

      finish(reject, error);
    });


    ws.on('close', () => {
      if (!settled) {
        finish(
          reject,
          new Error(
            'iFLYTEK connection closed before transcription completed'
          )
        );
      }
    });
  });
}


// =========================
// HTTP Server
// =========================

const server = http.createServer((req, res) => {
  res.setHeader(
    'Access-Control-Allow-Origin',
    'http://localhost:5173'
  );

  res.setHeader(
    'Access-Control-Allow-Credentials',
    'true'
  );

  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type'
  );

  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET,POST,OPTIONS'
  );


  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }


    // -------------------------
  // Bayesian evidence detector
  // -------------------------

  if (
    req.method === 'POST' &&
    req.url === '/api/functions/detectEvidence'
  ) {
    let body = '';

    req.on('data', chunk => {
      body += chunk;
    });

    req.on('end', async () => {
      try {
        const payload =
          JSON.parse(body || '{}');

        const studentText =
          payload.studentText || '';

        const evidence =
          await classifyStudentEvidence(
            studentText
          );

        console.log(
          'Detected evidence:',
          evidence
        );
  
        const testState =
  createBayesianSession();
        
        const bayesianResult =
          processEvidence(
            testState,
            evidence
          );

        console.log(
          'Bayesian result:',
          bayesianResult
        );

        res.writeHead(200, {
          'Content-Type':
            'application/json; charset=utf-8',
        });

        res.end(
          JSON.stringify({
            evidence,
            bayesianResult,
          })
        );
      } catch (error) {
        console.error(
          'Evidence detection error:',
          error
        );

        res.writeHead(500, {
          'Content-Type':
            'application/json; charset=utf-8',
        });

        res.end(
          JSON.stringify({
            error:
              error.message ||
              'Evidence detection failed',
          })
        );
      }
    });

    return;
  }

  // -------------------------
  // Aristotle / DeepSeek
  // -------------------------

  if (
    req.method === 'POST' &&
    req.url === '/api/functions/aristotleChat'
  ) {
    let body = '';

    req.on('data', chunk => {
      body += chunk;
    });

    req.on('end', async () => {
      try {
        const payload = JSON.parse(body || '{}');

        const messages = Array.isArray(payload.messages)
          ? payload.messages
          : [];

        const sessionId =
          typeof payload.sessionId === 'string'
            ? payload.sessionId
           : '';

        console.log(
          `Received ${messages.length} Aristotle messages`
        );

        const latestUserMessage =
  [...messages]
    .reverse()
    .find(message => message.role === 'user');

let evidence =
  createNoEvidenceResult();

let bayesianResult = null;

if (latestUserMessage?.content) {
  evidence =
    await classifyStudentEvidence(
      latestUserMessage.content
    );

  const conversationState =
    getBayesianSession(sessionId);

  bayesianResult =
    processEvidence(
      conversationState,
      evidence
    );

  console.log(
    'Chat Bayesian routing:',
    {
      sessionId,
      evidence,
      activeNode:
        bayesianResult.activeNode,
      route:
        bayesianResult.route
          ? `${bayesianResult.route.source} -> ${bayesianResult.route.target}`
          : null,
      turnCount:
        bayesianResult.turnCount,
    }
  );
}

        const routingContext =
  bayesianResult?.route?.targetNode || null;

const reply = await callDeepSeek(
  messages,
  routingContext
);

        res.writeHead(200, {
          'Content-Type':
            'application/json; charset=utf-8',
        });

res.end(
  JSON.stringify({
    reply,
    bayesianDebug: bayesianResult
      ? {
          evidence,
          activeNode:
            bayesianResult.activeNode,
          route:
            bayesianResult.route
              ? {
                  source:
                    bayesianResult.route.source,
                  target:
                    bayesianResult.route.target,
                  score:
                    bayesianResult.route.score,
                }
              : null,
          turnCount:
            bayesianResult.turnCount,
        }
      : null,
  })
);

      } catch (error) {
        console.error(
          'Aristotle error:',
          error
        );

        res.writeHead(500, {
          'Content-Type':
            'application/json; charset=utf-8',
        });

        res.end(
          JSON.stringify({
            error:
              error.message ||
              'Model request failed',
          })
        );
      }
    });

    return;
  }


  // -------------------------
  // Speech-to-text / iFLYTEK
  // -------------------------

  if (
    req.method === 'POST' &&
    req.url === '/api/functions/transcribe'
  ) {
    let body = '';

    req.on('data', chunk => {
      body += chunk;
    });

    req.on('end', async () => {
      try {
        const payload =
          JSON.parse(body || '{}');

        if (!payload.audioBase64) {
          throw new Error(
            'audioBase64 is required'
          );
        }

        const pcmBuffer = Buffer.from(
          payload.audioBase64,
          'base64'
        );

        console.log(
          `Received STT audio: ${pcmBuffer.length} bytes`
        );

        const transcript =
          await callXfyunSTT(pcmBuffer);

        res.writeHead(200, {
          'Content-Type':
            'application/json; charset=utf-8',
        });

        res.end(
          JSON.stringify({
            transcript,
          })
        );

      } catch (error) {
        console.error(
          'STT error:',
          error
        );

        res.writeHead(500, {
          'Content-Type':
            'application/json; charset=utf-8',
        });

        res.end(
          JSON.stringify({
            error:
              error.message ||
              'Speech recognition failed',
          })
        );
      }
    });

    return;
  }


  // -------------------------
  // Production frontend
  // -------------------------

  if (req.method === 'GET') {
    const requestUrl = new URL(
      req.url,
      `http://${req.headers.host || 'localhost'}`
    );

    const requestedPath =
      requestUrl.pathname === '/'
        ? 'index.html'
        : requestUrl.pathname.slice(1);

    const filePath = path.resolve(
      distPath,
      requestedPath
    );

    const safeDistPath =
      path.resolve(distPath) + path.sep;

    if (
      filePath.startsWith(safeDistPath) &&
      fs.existsSync(filePath) &&
      fs.statSync(filePath).isFile()
    ) {
      const extension = path.extname(filePath);

      const contentTypes = {
        '.html': 'text/html; charset=utf-8',
        '.js': 'text/javascript; charset=utf-8',
        '.css': 'text/css; charset=utf-8',
        '.svg': 'image/svg+xml',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.ico': 'image/x-icon',
        '.woff': 'font/woff',
        '.woff2': 'font/woff2',
      };

      res.writeHead(200, {
        'Content-Type':
          contentTypes[extension] ||
          'application/octet-stream',
      });

      fs.createReadStream(filePath).pipe(res);
      return;
    }

    // React Router fallback.
    const indexPath = path.join(
      distPath,
      'index.html'
    );

    if (fs.existsSync(indexPath)) {
      res.writeHead(200, {
        'Content-Type':
          'text/html; charset=utf-8',
      });

      fs.createReadStream(indexPath).pipe(res);
      return;
    }
  }

  res.writeHead(404, {
    'Content-Type':
      'application/json; charset=utf-8',
  });

  res.end(
    JSON.stringify({
      error: 'Not found',
    })
  );
});


server.listen(PORT, () => {
  console.log(
    `Aristotle backend running at http://localhost:${PORT}`
  );

  console.log(
    `Model: ${
      process.env.DEEPSEEK_MODEL ||
      'deepseek-v4-flash'
    }`
  );

  console.log(
    'iFLYTEK STT: configured'
  );
});