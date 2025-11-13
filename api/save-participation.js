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
    const { sessionId, clientName, clientPhone, clientEmail, prize, code, channel } = req.body;

    if (!sessionId || !clientName || !prize || !code) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const sql = neon(process.env.DATABASE_URL);

    // Sauvegarder la participation
    const result = await sql`
      INSERT INTO participations (
        session_id, client_name, client_phone, client_email, prize_emoji, prize_title, 
        prize_description, promo_code, channel, review_clicked, scratched, 
        created_at
      ) VALUES (
        ${sessionId}, ${clientName}, ${clientPhone || ''}, ${clientEmail || ''}, ${prize.emoji}, 
        ${prize.title}, ${prize.description}, ${code}, ${channel || 'direct'}, 
        true, true, NOW()
      )
      RETURNING *
    `;

    console.log('✅ Participation sauvegardée:', result[0]);

    // 📧 Envoyer l'email SI un email est fourni
    if (clientEmail && clientEmail.trim() !== '') {
      try {
        const emailResponse = await fetch(`${req.headers.origin || 'https://gami.rocandlove.fr'}/api/send-prize-email`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            clientName: clientName,
            clientEmail: clientEmail,
            prizeEmoji: prize.emoji,
            prizeTitle: prize.title,
            prizeDescription: prize.description,
            promoCode: code
          })
        });

        if (emailResponse.ok) {
          console.log('✅ Email envoyé avec succès');
        } else {
          console.error('⚠️ Erreur envoi email (non bloquant)');
        }
      } catch (emailError) {
        console.error('⚠️ Erreur envoi email (non bloquant):', emailError);
        // Ne pas bloquer si l'email échoue
      }
    } else {
      console.log('ℹ️ Pas d\'email fourni, envoi skippé');
    }

    res.status(200).json({ 
      success: true, 
      participation: result[0],
      emailSent: clientEmail ? true : false
    });

  } catch (error) {
    console.error('Error saving participation:', error);
    res.status(500).json({ 
      error: 'Failed to save participation',
      details: error.message 
    });
  }
}
