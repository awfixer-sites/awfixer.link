const { createClient } = require('@supabase/supabase-js');

export default async function handler(req, res) {
  const slug = req.query.slug ? req.query.slug.join('/') : '';

  if (!slug) {
    return res.status(404).json({ error: 'Not found' });
  }

  try {
    const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_KEY);

    // For now, query database directly instead of KV cache
    const { data, error } = await supabase.from('links').select('*').eq('slug', slug).single();

    if (error || !data) {
      return res.status(404).json({ error: 'Not found' });
    }

    const userAgent = req.headers['user-agent'] || '';

    let redirectUrl = data.url;
    if (/android/i.test(userAgent) && data.meta?.android_url) {
      redirectUrl = data.meta.android_url;
    } else if (/iPad|iPhone|iPod/.test(userAgent) && data.meta?.ios_url) {
      redirectUrl = data.meta.ios_url;
    }

    res.redirect(302, redirectUrl);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
}