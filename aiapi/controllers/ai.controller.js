

export const generateSuggestion = async (req, res) => {
  try {
    if (!req.body.prompt || typeof req.body.prompt !== 'string' || req.body.prompt.trim() === '') {
      return res.status(400).json({ error: 'Prompt is required and must be a non-empty string' });
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": process.env.YOUR_SITE_URL || '',
        "X-Title": process.env.YOUR_SITE_NAME || '',
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-r1:free",
        messages: [{ role: "user", content: req.body.prompt }],
      }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to fetch suggestion');

    res.json({ suggestion: data.choices[0].message.content });
  } catch (error) {
    console.error('Error generating suggestion:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};


export const summarize = async (req, res) => {
  try {
    if (!req.body.messages || !Array.isArray(req.body.messages)) {
      return res.status(400).json({ error: 'Messages must be an array' });
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": process.env.YOUR_SITE_URL || '',
        "X-Title": process.env.YOUR_SITE_NAME || '',
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-r1:free",
        messages: req.body.messages,
      }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to fetch summary');

    res.json({ summary: data.choices[0].message.content });
  } catch (error) {
    console.error('Error summarizing conversation:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};


export const analyzeSentiment = async (req, res) => {
  try {
    if (!req.body.text) {
      return res.status(400).json({ error: 'Text is required for sentiment analysis' });
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": process.env.YOUR_SITE_URL || '',
        "X-Title": process.env.YOUR_SITE_NAME || '',
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-r1:free",
        messages: [
          { role: "user", content: `Analyze the sentiment of this text: "${req.body.text}"` },
        ],
      }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to fetch sentiment');

    res.json({ sentiment: data.choices[0].message.content });
  } catch (error) {
    console.error('Sentiment Analysis Error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};



