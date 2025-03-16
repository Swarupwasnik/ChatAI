import WebSocket from 'ws';
import jwt from 'jsonwebtoken';
import { 
    generateChatResponse,
    summarizeConversation,
    analyzeSentiment
  } from '../services/openai.service.js';
  import { WebSocketServer } from 'ws';

  
const clients = new Map();
const messageHistory = [];

export default (server) => {
    const wss = new WebSocketServer({ server });

  wss.on('connection', (ws, req) => {
    try {
      const token = new URLSearchParams(req.url.split('?')[1]).get('token');
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      ws.user = decoded;
      clients.set(ws.user.username, ws);

      // Send message history to new client
      ws.send(JSON.stringify({ type: 'history', data: messageHistory }));

      ws.on('message', async (message) => {
        const msgData = JSON.parse(message);
        const aiResponseNeeded = msgData.aiAssisted;

        // Store message
        const messageEntry = {
          user: ws.user.username,
          content: msgData.content,
          timestamp: new Date(),
        };
        messageHistory.push(messageEntry);

        // Broadcast to all clients
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type: 'message', data: messageEntry }));
          }
        });

        // Generate AI response if needed
        if (aiResponseNeeded) {
          const aiMessage = await openaiService.generateChatResponse(msgData.content);
          const aiEntry = {
            user: 'AI Assistant',
            content: aiMessage,
            timestamp: new Date(),
          };
          messageHistory.push(aiEntry);
          ws.send(JSON.stringify({ type: 'message', data: aiEntry }));
        }
      });

      ws.on('close', () => {
        clients.delete(ws.user.username);
      });

    } catch (error) {
      ws.close(1008, 'Authentication failed');
    }
  });
};
