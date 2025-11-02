const { createClient } = require('@supabase/supabase-js');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const requestData = req.body;

    if (
      !requestData.token ||
      !requestData.link_id ||
      !/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(requestData.link_id)
    ) {
      return res.status(400).json({ error: 'Invalid request data' });
    }

    const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_KEY);
    supabase.auth.setAuth(requestData.token);

    const { data, error } = await supabase.from('links').select('*').eq('id', requestData.link_id);
    if (error) throw error;

    // For now, skip KV update since we're not using caching
    // await updateKV(requestData, data);

    res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.status(200).json({ message: 'OK' });
  } catch (error) {
    console.error(error);
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.status(500).json({ error: 'Server Error' });
  }
}