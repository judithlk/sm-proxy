import express from 'express';
import axios from 'axios';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
console.log('BACKEND_URL:', process.env.BACKEND_URL);


const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Replaces body-parser

// Environment-based backend URL
const BACKEND_URL = process.env.BACKEND_URL || 'https://smart-waste-backend-wsmj.onrender.com';

// Root route for health check
app.get('/', (req, res) => {
  res.send('Smart Waste Proxy is running ✅');
});

// Forward PUT requests to backend
app.put('/bins/:id', async (req, res) => {
  try {
    const response = await axios.put(
      `${BACKEND_URL}/api/bins/${req.params.id}`,
      req.body,
      {
        headers: {
          Authorization: req.headers.authorization || '',
          'Content-Type': 'application/json',
        },
      }
    );

    res.status(response.status).send(response.data);
  } catch (error: any) {
    console.error('Proxy error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).send({
      error: error.response?.data || 'Failed to forward request',
    });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Proxy server running on port ${PORT}`);
});
