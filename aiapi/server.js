import 'dotenv/config';
import express from 'express';
import http from 'http';
import WebSocket from 'ws';
import cors from 'cors';
import bodyParser from 'body-parser';
import authMiddleware from './middleware/auth.js';
import * as authController from "./controllers/authController.js";
import * as aiController from './controllers/ai.controller.js'
import setupWebSocket from './utils/websocket.js'

const app = express();
const port = process.env.PORT || 3001;


app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use((req, res, next) => {
  req.setTimeout(30000); 
  res.setTimeout(30000);
  next();
});
app.use(bodyParser.json());


app.post('/api/login', authController.login);
app.get('/api/profile', authMiddleware, authController.profileInfo);

app.post('/api/summarize', authMiddleware, aiController.summarize);
app.post('/api/sentiment', authMiddleware, aiController.analyzeSentiment);

app.post('/api/suggest', authMiddleware, aiController.generateSuggestion);

const server = http.createServer(app);

setupWebSocket(server);

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
