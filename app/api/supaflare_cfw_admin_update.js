const { createClient } = require('@supabase/supabase-js');
const jwt = require('jsonwebtoken'); // Using jsonwebtoken instead of cloudflare-jwt

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const requestData = req.body;

    if (
      !requestData.admin_key ||
      requestData.admin_key !== process.env.SUPAFLARE_ADMIN_KEY ||
      !requestData.token ||
      !requestData.link_id ||
      !/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(requestData.link_id)
    ) {
      return res.status(400).json({ error: 'Invalid request data' });
    }

    const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_KEY);

    // Verify JWT token
    const decoded = jwt.verify(requestData.token, process.env.SUPABASE_JWT_SECRET);
    const serviceRoleToken = jwt.sign({ ...decoded, role: 'service_role' }, process.env.SUPABASE_JWT_SECRET);

    supabase.auth.setAuth(serviceRoleToken);

    const { data, error } = await supabase.from('links').select('*').eq('id', requestData.link_id);
    if (error) throw error;

    // Skip KV update for now

    res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.status(200).json({ message: 'OK' });
  } catch (error) {
    console.error(error);
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.status(500).json({ error: 'Server Error' });
  }
}