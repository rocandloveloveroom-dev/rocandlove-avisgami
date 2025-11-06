import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const sql = neon(process.env.DATABASE_URL);

    const participations = await sql`
      SELECT * FROM participations 
      ORDER BY created_at DESC
    `;

    res.status(200).json({ 
      success: true, 
      participations 
    });

  } catch (error) {
    console.error('Error fetching participations:', error);
    res.status(500).json({ 
      error: 'Failed to fetch participations',
      details: error.message 
    });
  }
}
