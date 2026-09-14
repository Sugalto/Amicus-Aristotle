import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import WebSocket from 'ws';

const PORT = 3001;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const promptPath = path.join(__dirname, 'prompts', 'aristotle.md');
const ARISTOTLE_PROMPT = fs.readFileSync(promptPath, 'utf8');


// =========================
// DeepSeek
// =========================

async function callDeepSeek(messages) {
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
          content: ARISTOTLE_PROMPT,
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

        console.log(
          `Received ${messages.length} Aristotle messages`
        );

        const reply = await callDeepSeek(messages);

        res.writeHead(200, {
          'Content-Type':
            'application/json; charset=utf-8',
        });

        res.end(
          JSON.stringify({
            reply,
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