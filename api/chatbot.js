import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST requests allowed' });
  }

  const { prompt, userId = null } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'Missing prompt' });
  }

  try {
    // 1. Query Hugging Face
    const hfResponse = await fetch(
      "https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: prompt }),
      }
    );

    if (!hfResponse.ok) {
      return res.status(hfResponse.status).json({ error: "Error from Hugging Face API" });
    }

    const data = await hfResponse.json();

    const reply =
      data?.[0]?.generated_text ||
      data?.generated_text ||
      "No reply from model.";

    // 2. Save to Supabase
    const { error: dbError } = await supabase
      .from('chat_sessions')
      .insert([
        {
          user_id: userId,
          user_input: prompt,
          bot_output: reply,
        },
      ]);

    if (dbError) {
      console.error("Supabase Insert Error:", dbError);
    }

    // 3. Return response
    res.status(200).json({ reply });
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
