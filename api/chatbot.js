// File: /api/chatbot.js

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt, userId } = req.body;
    if (!prompt || !userId) {
      return res.status(400).json({ error: 'Missing prompt or userId' });
    }

    // Simulate reply
    res.status(200).json({ reply: `Simulated reply to: "${prompt}"` });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
};
