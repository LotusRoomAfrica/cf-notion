export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST requests allowed' });
  }

  const { prompt, userId } = req.body;

  if (!prompt || !userId) {
    return res.status(400).json({ error: 'Missing prompt or userId' });
  }

  try {
    // Call Hugging Face API
    const response = await fetch(
      'https://api-inference.huggingface.co/models/gpt2',  // Change to your model if needed
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inputs: prompt }),
      }
    );

    const data = await response.json();

    const botReply = data[0]?.generated_text || "Sorry, I couldn't generate a reply.";

    // You can add code here to save to Supabase if you want (optional)

    return res.status(200).json({ reply: botReply });
  } catch (error) {
    console.error('Error calling Hugging Face:', error);
    return res.status(500).json({ error: 'Failed to get response from Hugging Face' });
  }
}
