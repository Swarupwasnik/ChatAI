require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3125,
  jwtSecret: process.env.JWT_SECRET,
  openRouter: {
    apiKey: process.env.OPENROUTER_API_KEY,
    baseUrl: 'https://openrouter.ai/api/v1/chat/completions'
  }
};