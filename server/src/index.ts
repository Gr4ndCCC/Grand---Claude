import express from 'express';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import cors from 'cors';
import dotenv from 'dotenv';
import { handleSession } from './session.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (_req, res) => {
  res.send('Ora backend is running. Open <a href="http://localhost:5173">http://localhost:5173</a> to use the app.');
});

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'Ora' });
});

const httpServer = createServer(app);
const wss = new WebSocketServer({ server: httpServer });

wss.on('connection', (ws, req) => {
  const ip = req.socket.remoteAddress ?? 'unknown';
  console.log(`[WS] Client connected from ${ip}`);
  handleSession(ws);
});

const PORT = parseInt(process.env.PORT ?? '3001', 10);
httpServer.listen(PORT, () => {
  console.log(`Ora server listening on http://localhost:${PORT}`);
});
