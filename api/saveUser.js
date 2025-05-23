// api/saveUser.js
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Only POST allowed' })

  const { name, email, brand_summary, campaign_type } = req.body

  const { data, error } = await supabase.from('users').insert([
    { name, email, brand_summary, campaign_type }
  ])

  if (error) return res.status(500).json({ error })

  res.status(200).json({ message: 'Saved!', data })
}
