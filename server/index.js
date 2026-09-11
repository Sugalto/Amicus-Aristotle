import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const PORT = 3001;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const promptPath = path.join(__dirname, 'prompts', 'aristotle.md');
const ARISTOTLE_PROMPT = fs.readFileSync(promptPath, 'utf8');

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
      data?.error?.message || `DeepSeek request failed (${response.status})`
    );
  }

  const reply = data?.choices?.[0]?.message?.content;

  if (!reply) {
    console.error('DeepSeek returned no content:', data);
    throw new Error('DeepSeek returned an empty reply');
  }

  return reply;
}

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

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

        console.log(`Received ${messages.length} Aristotle messages`);

        const reply = await callDeepSeek(messages);

        res.writeHead(200, {
          'Content-Type': 'application/json; charset=utf-8',
        });

        res.end(
          JSON.stringify({
            reply,
          })
        );
      } catch (error) {
        console.error('Aristotle error:', error);

        res.writeHead(500, {
          'Content-Type': 'application/json; charset=utf-8',
        });

        res.end(
          JSON.stringify({
            error: error.message || 'Model request failed',
          })
        );
      }
    });

    return;
  }

  res.writeHead(404, {
    'Content-Type': 'application/json; charset=utf-8',
  });

  res.end(
    JSON.stringify({
      error: 'Not found',
    })
  );
});

server.listen(PORT, () => {
  console.log(`Aristotle backend running at http://localhost:${PORT}`);
  console.log(
    `Model: ${process.env.DEEPSEEK_MODEL || 'deepseek-v4-flash'}`
  );
});