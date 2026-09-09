import http from 'node:http';

const PORT = 3001;

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

  if (req.method === 'POST' && req.url === '/api/functions/aristotleChat') {
    let body = '';

    req.on('data', chunk => {
      body += chunk;
    });

    req.on('end', () => {
      try {
        const payload = JSON.parse(body || '{}');

        console.log('Received aristotleChat payload:');
        console.log(payload);

        res.writeHead(200, {
          'Content-Type': 'application/json; charset=utf-8',
        });

        res.end(JSON.stringify({
          reply: '我聽見你的想法了。你認為植物的質量主要來自泥土，對嗎？'
        }));
      } catch (error) {
        res.writeHead(400, {
          'Content-Type': 'application/json; charset=utf-8',
        });

        res.end(JSON.stringify({
          error: 'Invalid JSON payload'
        }));
      }
    });

    return;
  }

  res.writeHead(404, {
    'Content-Type': 'application/json; charset=utf-8',
  });

  res.end(JSON.stringify({
    error: 'Not found'
  }));
});

server.listen(PORT, () => {
  console.log(`Aristotle backend running at http://localhost:${PORT}`);
});