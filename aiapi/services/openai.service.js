
const BASE_URL = 'https://openrouter.ai/api/v1/chat/completions';
const API_KEY = process.env.OPENROUTER_API_KEY;


export const generateSuggestion = async (prompt) => {
  try {
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'HTTP-Referer': process.env.YOUR_SITE_URL || '',
        'X-Title': process.env.YOUR_SITE_NAME || '', 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-r1:free',
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to fetch suggestion');

    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error generating suggestion:', error);
    throw error;
  }
};


export const summarizeConversation = async (messages) => {
  try {
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'HTTP-Referer': process.env.YOUR_SITE_URL || '',
        'X-Title': process.env.YOUR_SITE_NAME || '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-r1:free',
        messages: [
          {
            role: 'user',
            content: `Summarize this conversation:\n\n${messages.join('\n')}`,
          },
        ],
      }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to fetch summary');

    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error summarizing conversation:', error);
    throw error;
  }
};


export const analyzeSentiment = async (text) => {
  try {
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'HTTP-Referer': process.env.YOUR_SITE_URL || '',
        'X-Title': process.env.YOUR_SITE_NAME || '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-r1:free',
        messages: [
          {
            role: 'user',
            content: `Analyze sentiment of this text: "${text}". Respond with JSON: {sentiment: 'positive|neutral|negative'}`,
          },
        ],
      }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to fetch sentiment');

    return JSON.parse(data.choices[0].message.content);
  } catch (error) {
    console.error('Error analyzing sentiment:', error);
    throw error;
  }
};


export const generateChatResponse = async (message) => {
  try {
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'HTTP-Referer': process.env.YOUR_SITE_URL || '',
        'X-Title': process.env.YOUR_SITE_NAME || '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-r1:free',
        messages: [
          {
            role: 'user',
            content: `Respond to this message: "${message}"`,
          },
        ],
      }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to fetch chat response');

    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error generating chat response:', error);
    throw error;
  }
};
