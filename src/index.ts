import express from 'express';
import * as http from 'http';
import * as https from 'https';
import cors from 'cors';

const app = express();

const BACKEND_URL = 'https://smart-waste-backend-wsmj.onrender.com';

app.use(cors());
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.send('Proxy is alive ✅');
});

// Main route to receive POST and forward as PUT
app.post('/bins/by-binId/:binId', (req, res) => {
  const { binId } = req.params;
  const bodyData = JSON.stringify(req.body);

  const options = {
    hostname: 'smart-waste-backend-wsmj.onrender.com',
    port: 443,
    path: `/api/bins/by-binId/${binId}`,
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(bodyData),
    },
  };

  console.log(`[Proxy] Sending PUT to: ${options.hostname}${options.path}`);
  console.log(`[Proxy] Payload: ${bodyData}`);

  const proxyReq = https.request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode || 500, proxyRes.headers);
    proxyRes.pipe(res, { end: true });
  });

  proxyReq.on('error', (err) => {
    console.error('[Proxy Error]', err.message);
    res.status(500).json({ error: 'Proxy failed' });
  });

  proxyReq.write(bodyData);
  proxyReq.end();
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Proxy server running on http://localhost:${PORT}`);
});
