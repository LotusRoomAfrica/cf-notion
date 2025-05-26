import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST requests allowed' });
  }

  const { prompt, userId } = req.body;

  if (!prompt || !userId) {
    return res.status(400).json({ error: 'Missing prompt or userId' });
  }

  try {
    const response = await fetch(
      'https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inputs: prompt }),
      }
    );

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: 'Error from Hugging Face API' });
    }

    const data = await response.json();
    const reply =
      data?.[0]?.generated_text ||
      data?.generated_text ||
      'No reply from model.';

    const { error } = await supabase.from('chat_sessions').insert([
      {
        user_id: userId,
        user_input: prompt,
        bot_output: reply,
      },
    ]);

    if (error) {
      console.error('Supabase error:', error);
    }

    res.status(200).json({ reply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
