import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { clientName, clientPhone } = req.body;

    if (!clientName && !clientPhone) {
      return res.status(400).json({ error: 'Client name or phone required' });
    }

    const sql = neon(process.env.DATABASE_URL);

    // Chercher une participation existante
    // Priorité au téléphone (plus fiable), sinon nom
    let result;
    
    if (clientPhone && clientPhone.trim() !== '') {
      // Vérifier par téléphone (plus fiable)
      result = await sql`
        SELECT * FROM participations 
        WHERE client_phone = ${clientPhone}
        ORDER BY created_at DESC
        LIMIT 1
      `;
    } else if (clientName) {
      // Vérifier par nom (moins fiable mais mieux que rien)
      result = await sql`
        SELECT * FROM participations 
        WHERE client_name = ${clientName}
        ORDER BY created_at DESC
        LIMIT 1
      `;
    }

    if (result && result.length > 0) {
      // Client a déjà joué !
      const participation = result[0];
      
      res.status(200).json({ 
        hasPlayed: true,
        participation: {
          clientName: participation.client_name,
          prizeEmoji: participation.prize_emoji,
          prizeTitle: participation.prize_title,
          prizeDescription: participation.prize_description,
          promoCode: participation.promo_code,
          date: participation.created_at
        }
      });
    } else {
      // Client n'a jamais joué
      res.status(200).json({ 
        hasPlayed: false 
      });
    }

  } catch (error) {
    console.error('Error checking participation:', error);
    res.status(500).json({ 
      error: 'Failed to check participation',
      details: error.message 
    });
  }
}
