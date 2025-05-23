module.exports = async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { prompt, userId } = req.body;
    if (!prompt || !userId) {
      return res.status(400).json({ error: "Missing prompt or userId" });
    }

    // Simulated AI reply
    const reply = `Simulated reply to: "${prompt}"`;

    return res.status(200).json({ reply });
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({ error: "Something went wrong!" });
  }
};
