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
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST requests allowed" });
  }

  const { prompt, userId } = req.body;

  if (!prompt || !userId) {
    return res.status(400).json({ error: "Missing prompt or userId" });
  }

  // Step 1: Call Hugging Face (or mock it for now)
  const simulatedReply = `Simulated reply to: "${prompt}"`;

  // Step 2: Save to Supabase
  const { data, error } = await supabase
    .from('sessions') // Make sure this table exists in Supabase
    .insert([{ prompt, reply: simulatedReply, user_id: userId }]);

  if (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to save session" });
  }

  // Step 3: Return the reply
  return res.status(200).json({ reply: simulatedReply });
}
