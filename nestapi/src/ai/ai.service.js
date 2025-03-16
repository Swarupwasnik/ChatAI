const { Injectable } = require('@nestjs/common');
const axios = require('axios');
const config = require('../config/configuration');

@Injectable()
class AiService {
  async generateResponse(prompt, context = []) {
    try {
      const response = await axios.post(
        config.openRouter.baseUrl,
        {
          model: 'google/palm-2',
          messages: [
            ...context,
            { role: 'user', content: prompt }
          ]
        },
        {
          headers: {
            'Authorization': `Bearer ${config.openRouter.apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': config.yourSiteUrl,
            'X-Title': config.yourSiteName
          }
        }
      );
      
      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('AI API Error:', error.response.data);
      throw new Error('Failed to generate AI response');
    }
  }

  async analyzeSentiment(message) {
    const prompt = `Analyze sentiment of this message: "${message}". Respond with JSON: {sentiment: "positive|neutral|negative", confidence: 0-1}`;
    return this.generateResponse(prompt);
  }

  async summarizeConversation(messages) {
    const prompt = `Summarize this conversation into 3 key points: ${JSON.stringify(messages)}`;
    return this.generateResponse(prompt);
  }
}

module.exports = AiService;