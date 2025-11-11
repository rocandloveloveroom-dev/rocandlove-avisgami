import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ error: 'Code is required' });
  }

  try {
    const sql = neon(process.env.DATABASE_URL);

    // Récupérer le lien court
    const result = await sql`
      SELECT * FROM short_links WHERE code = ${code}
    `;

    if (result.length === 0) {
      return res.status(404).json({ error: 'Short link not found' });
    }

    const shortLink = result[0];

    // Incrémenter le compteur de clics
    await sql`
      UPDATE short_links 
      SET clicks = clicks + 1 
      WHERE code = ${code}
    `;

    // Construire l'URL de destination
    const baseUrl = 'https://rocandlove-avisgami.vercel.app';
    let destinationUrl = `${baseUrl}/?n=${encodeURIComponent(shortLink.client_name)}`;
    
    if (shortLink.client_phone) {
      destinationUrl += `&t=${encodeURIComponent(shortLink.client_phone)}`;
    }
    
    destinationUrl += `&s=${shortLink.channel}`;

    // Redirection
    res.writeHead(302, { Location: destinationUrl });
    res.end();

  } catch (error) {
    console.error('Error resolving short link:', error);
    res.status(500).json({ 
      error: 'Failed to resolve short link',
      details: error.message 
    });
  }
}
