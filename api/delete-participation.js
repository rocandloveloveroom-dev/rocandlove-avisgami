import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'DELETE,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Accepte DELETE ou POST (pour plus de compatibilité)
  if (req.method !== 'DELETE' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID required' });
    }

    const sql = neon(process.env.DATABASE_URL);

    // Supprimer la participation dans Neon
    const result = await sql`
      DELETE FROM participations 
      WHERE session_id = ${sessionId}
      RETURNING *
    `;

    if (result.length === 0) {
      return res.status(404).json({ error: 'Participation not found' });
    }

    res.status(200).json({ 
      success: true, 
      message: 'Participation supprimée',
      deleted: result[0]
    });

  } catch (error) {
    console.error('Error deleting participation:', error);
    res.status(500).json({ 
      error: 'Failed to delete participation',
      details: error.message 
    });
  }
}
