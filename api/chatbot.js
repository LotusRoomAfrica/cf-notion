import { createClient } from '@supabase/supabase-js'
import fetch from 'node-fetch' // Vercel supports fetch natively, but this ensures compatibility

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST requests allowed' })
  }

  const { prompt, userId } = req.body

  if (!prompt || !userId) {
    return res.status(400).json({ error: 'Missing prompt or userId' })
  }

  try {
    // Call Hugging Face Inference API
    const response = await fetch('https://api-inference.huggingface.co/models/gpt2', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ inputs: prompt }),
    })

    if (!response.ok) {
      const errorDetails = await response.text()
      return res.status(500).json({ error: 'Hugging Face API error', details: errorDetails })
    }

    const result = await response.json()
    // Extract generated text (adjust depending on model response format)
    const reply = result[0]?.generated_text || "Sorry, no response."

    // Save prompt + reply to Supabase
    const { data, error } = await supabase
      .from('sessions')  // replace 'sessions' with your actual table name
      .insert([{ user_id: userId, prompt, reply }])

    if (error) {
      return res.status(500).json({ error: 'Database error', details: error.message })
    }

    // Send bot reply back
    res.status(200).json({ reply })

  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message })
  }
}
