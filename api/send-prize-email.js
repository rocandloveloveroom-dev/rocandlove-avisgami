import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

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
    const { clientName, clientEmail, prizeEmoji, prizeTitle, prizeDescription, promoCode } = req.body;

    if (!clientEmail || !clientName || !promoCode) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Générer l'email HTML
    const emailHtml = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <!-- Import des vraies polices -->
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600;700&display=swap" rel="stylesheet">
  <link href="https://fonts.cdnfonts.com/css/brittany-signature" rel="stylesheet">
  <style>
    body { 
      margin: 0; 
      padding: 0; 
      font-family: 'Cormorant Garamond', Georgia, serif; 
      background-color: #000000; 
    }
    .container { 
      max-width: 600px; 
      margin: 0 auto; 
      background: linear-gradient(135deg, #1a1a1a 0%, #000000 100%); 
    }
    .header { 
      background: linear-gradient(135deg, #B9A378 0%, #8B7355 100%); 
      padding: 40px 20px; 
      text-align: center; 
    }
    .logo { 
      font-family: 'Brittany Signature', cursive; 
      font-size: 62px; 
      color: #000000; 
      margin: 0; 
    }
    .content { 
      padding: 40px 30px; 
      color: #DCD1BC; 
    }
    .prize-box { 
      background: rgba(185, 163, 120, 0.1); 
      border: 2px solid #B9A378; 
      border-radius: 16px; 
      padding: 30px; 
      text-align: center; 
      margin: 30px 0; 
    }
    .emoji { 
      font-size: 48px; 
      margin-bottom: 20px; 
    }
    .prize-title { 
      font-size: 28px; 
      color: #B9A378; 
      margin: 15px 0; 
      font-weight: bold; 
    }
    .prize-description { 
      font-size: 16px; 
      color: #DCD1BC; 
      margin-bottom: 20px; 
    }
    .code-box { 
      background: #000000; 
      border: 2px solid #B9A378; 
      border-radius: 12px; 
      padding: 20px; 
      margin: 25px 0; 
    }
    .code-label { 
      font-size: 14px; 
      color: #B9A378; 
      margin-bottom: 10px; 
    }
    .code { 
      font-family: 'Courier New', monospace; 
      font-size: 32px; 
      color: #B9A378; 
      letter-spacing: 0.3em; 
      font-weight: bold; 
    }
    .validity { 
      font-size: 14px; 
      color: #8B7355; 
      margin-top: 15px; 
      font-style: italic; 
    }
    .cta-button { 
      display: inline-block; 
      background: linear-gradient(135deg, #B9A378 0%, #8B7355 100%); 
      color: #000000; 
      padding: 18px 40px; 
      text-decoration: none; 
      border-radius: 12px; 
      font-weight: bold; 
      font-size: 18px; 
      margin: 30px 0; 
    }
    .footer { 
      padding: 30px; 
      text-align: center; 
      color: #666666; 
      font-size: 14px; 
      border-top: 1px solid #333333; 
    }
    .instructions { 
      background: rgba(185, 163, 120, 0.05); 
      border-left: 4px solid #B9A378; 
      padding: 20px; 
      margin: 25px 0; 
      color: #DCD1BC; 
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 class="logo">Roc & Love</h1>
    </div>
    
    <div class="content">
      <h2 style="color: #B9A378; font-size: 24px;">Bonjour ${clientName} ! 💛</h2>
      
      <p style="font-size: 16px; line-height: 1.6;">
        Merci infiniment pour votre séjour chez Roc & Love et pour votre avis !
      </p>
      
      <div class="prize-box">
        <div class="emoji">${prizeEmoji}</div>
        <div class="prize-title">${prizeTitle}</div>
        <div class="prize-description">${prizeDescription}</div>
        
        <div class="code-box">
          <div class="code-label">Votre code promo unique :</div>
          <div class="code">${promoCode}</div>
        </div>
        
        <div class="validity">⏰ Valable 6 mois</div>
      </div>
      
      <div class="instructions">
        <strong style="color: #B9A378;">💡 Comment utiliser votre code ?</strong><br><br>
        1. Rendez-vous sur <strong>www.rocandlove.fr</strong><br>
        2. Choisissez vos dates de séjour<br>
        3. Saisissez le code <strong>${promoCode}</strong> lors de la réservation<br>
        4. Profitez de votre avantage ! ✨
      </div>
      
      <div style="text-align: center;">
        <a href="https://www.rocandlove.fr" class="cta-button">
          🏡 Réserver maintenant
        </a>
      </div>
      
      <p style="font-size: 16px; line-height: 1.6; margin-top: 30px;">
        Nous avons hâte de vous accueillir à nouveau pour un moment encore plus magique ! ❤️
      </p>
      
      <p style="font-size: 14px; color: #8B7355; margin-top: 20px;">
        Conservez bien cet email, vous en aurez besoin lors de votre prochaine réservation.
      </p>
    </div>
    
    <div class="footer">
      <p style="margin: 5px 0;">Roc & Love - Love Room à Rochecorbon</p>
      <p style="margin: 5px 0;">
        <a href="https://www.rocandlove.fr" style="color: #B9A378; text-decoration: none;">www.rocandlove.fr</a>
      </p>
      <p style="margin: 15px 0 5px 0; font-size: 12px;">
        Vous recevez cet email suite à votre séjour chez nous.
      </p>
    </div>
  </div>
</body>
</html>
    `;

    // Envoyer l'email via Resend
    const data = await resend.emails.send({
      from: 'Roc & Love <contact@rocandlove.fr>',
      to: [clientEmail],
      subject: `${prizeEmoji} Votre code promo Roc & Love est arrivé !`,
      html: emailHtml,
    });

    console.log('✅ Email envoyé avec succès:', data);

    res.status(200).json({ 
      success: true,
      emailId: data.id,
      message: 'Email envoyé avec succès'
    });

  } catch (error) {
    console.error('❌ Erreur envoi email:', error);
    res.status(500).json({ 
      error: 'Failed to send email',
      details: error.message 
    });
  }
}
