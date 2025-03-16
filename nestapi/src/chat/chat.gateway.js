const { WebSocketGateway, WebSocketServer, SubscribeMessage } = require('@nestjs/websockets');

@WebSocketGateway()
class ChatGateway {
  @WebSocketServer() server;

  handleConnection(client) {
    console.log('Client connected:', client.id);
  }

  @SubscribeMessage('message')
  handleMessage(client, payload) {
    const response = {
      ...payload,
      timestamp: new Date().toISOString()
    };
    this.server.emit('message', response);
  }

  @SubscribeMessage('ai-assist')
  async handleAiAssist(client, payload) {
    const aiResponse = await this.aiService.generateResponse(payload.message);
    client.emit('ai-suggestion', { suggestion: aiResponse });
  }
}

module.exports = ChatGateway;