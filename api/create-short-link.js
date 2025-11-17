import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { clientName, clientPhone, clientEmail, channel } = req.body;

    console.log('📝 Création lien court - Données reçues:', { clientName, clientPhone, clientEmail, channel });

    if (!clientName) {
      return res.status(400).json({ error: 'Client name is required' });
    }

    const sql = neon(process.env.DATABASE_URL);

    // Générer un code court unique (5 caractères)
    let code = '';
    let isUnique = false;
    let attempts = 0;
    const maxAttempts = 10;

    while (!isUnique && attempts < maxAttempts) {
      // Générer un code aléatoire de 5 caractères (lettres + chiffres)
      code = Math.random().toString(36).substring(2, 7).toLowerCase();
      
      console.log(`🔍 Test code: ${code} (tentative ${attempts + 1})`);
      
      // Vérifier si le code existe déjà
      const existing = await sql`
        SELECT code FROM short_links WHERE code = ${code}
      `;
      
      if (existing.length === 0) {
        isUnique = true;
      }
      attempts++;
    }

    if (!isUnique) {
      console.error('❌ Impossible de générer un code unique');
      return res.status(500).json({ error: 'Failed to generate unique code' });
    }

    console.log(`✅ Code unique trouvé: ${code}`);

    // Insérer le lien court dans la base de données
    const result = await sql`
      INSERT INTO short_links (code, client_name, client_phone, client_email, channel, clicks)
      VALUES (${code}, ${clientName}, ${clientPhone || ''}, ${clientEmail || ''}, ${channel || 'direct'}, 0)
      RETURNING *
    `;

    console.log('✅ Lien court créé avec succès:', result[0]);

    const shortLink = result[0];
    const baseUrl = 'https://gami.rocandlove.fr';
    const shortUrl = `${baseUrl}/l/${code}`;

    res.status(200).json({ 
      success: true,
      code: code,
      shortUrl: shortUrl,
      link: shortLink
    });

  } catch (error) {
    console.error('❌ Erreur création lien court:', error);
    console.error('Stack:', error.stack);
    res.status(500).json({ 
      error: 'Failed to create short link',
      details: error.message 
    });
  }
}
