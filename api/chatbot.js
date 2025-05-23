export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST requests allowed" });
  }

  // Your logic goes here
}
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST requests allowed' })
  }

  // Step 4: AUTH CHECK will go here

  // Step 5: Extract prompt and userId from request body
  const { prompt, userId } = req.body

  if (!prompt || !userId) {
    return res.status(400).json({ error: 'Missing prompt or userId' })
  }

  // Step 6: Call Hugging Face API

  // Step 7: Save prompt and response to Supabase

  // Step 8: Return chatbot reply
}


