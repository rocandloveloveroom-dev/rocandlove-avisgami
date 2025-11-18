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
  <style>
    body { margin: 0; padding: 0; font-family: Georgia, "Times New Roman", serif; background-color: #000000; }
    .container { max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #1a1a1a 0%, #000000 100%); }
    .header { background: linear-gradient(135deg, #B9A378 0%, #8B7355 100%); padding: 36px 20px; text-align: center; }
    .logo { font-family: 'Brittany Signature', cursive; font-size: 44px; color: #000000; margin: 0; }
    .subtitle { margin-top: 8px; font-size: 13px; letter-spacing: 0.08em; text-transform: uppercase; color: #3b2b13; }
    .content { padding: 32px 30px 40px; color: #DCD1BC; }
    .content p { margin: 0 0 14px 0; }
    .prize-box { background: rgba(185, 163, 120, 0.10); border: 2px solid #B9A378; border-radius: 16px; padding: 26px 22px; text-align: center; margin: 26px 0 24px; }
    .emoji { font-size: 52px; margin-bottom: 10px; }
    .prize-label { font-size: 13px; color: #8B7355; text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 6px; }
    .prize-title { font-size: 24px; color: #B9A378; margin: 10px 0 8px; font-weight: bold; }
    .prize-description { font-size: 15px; color: #F0E8D5; margin-bottom: 16px; line-height: 1.5; }
    .code-box { background: #000000; border: 2px solid #B9A378; border-radius: 12px; padding: 18px 16px; margin: 18px 0 6px; }
    .code-label { font-size: 13px; color: #B9A378; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.15em; }
    .code { font-family: "Courier New", monospace; font-size: 26px; color: #B9A378; letter-spacing: 0.35em; font-weight: bold; }
    .validity { font-size: 13px; color: #8B7355; margin-top: 10px; font-style: italic; }
    .cta-wrapper { text-align: center; margin: 28px 0 10px; }
    .cta-button { display: inline-block; background: linear-gradient(135deg, #B9A378 0%, #8B7355 100%); color: #000000; padding: 15px 34px; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 16px; }
    .cta-button span { margin-left: 6px; }
    .instructions { background: rgba(185, 163, 120, 0.05); border-left: 4px solid #B9A378; padding: 16px 18px; margin: 20px 0 24px; color: #DCD1BC; font-size: 14px; line-height: 1.6; }
    .instructions-title { color: #B9A378; font-weight: bold; margin-bottom: 8px; }
    .footer { padding: 22px 24px 30px; text-align: center; color: #666666; font-size: 13px; border-top: 1px solid #333333; }
    .footer a { color: #B9A378; text-decoration: none; }
    @media screen and (max-width: 480px) {
      .content { padding: 26px 18px 32px; }
      .prize-box { padding: 22px 16px; }
      .cta-button { width: 100%; box-sizing: border-box; }
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- En-tête -->
    <div class="header">
      <h1 class="logo">Roc & Love</h1>
      <div class="subtitle">Love room &bull; Rochecorbon</div>
    </div>
    
    <!-- Contenu -->
    <div class="content">
      <h2 style="color: #B9A378; font-size: 22px; margin: 0 0 16px 0;">
        Bonjour ${clientName} 💝
      </h2>
      
      <p style="font-size: 15px; line-height: 1.6;">
        Un immense merci pour votre séjour au Roc & Love et pour le temps que vous avez pris pour nous laisser un avis. Vos mots comptent vraiment pour nous. ✨
      </p>
      
      <p style="font-size: 15px; line-height: 1.6;">
        Pour vous remercier, vous avez tiré au sort le cadeau suivant&nbsp;:
      </p>
      
      <!-- Bloc cadeau -->
      <div class="prize-box">
        <div class="emoji">${prizeEmoji}</div>
        <div class="prize-label">Votre cadeau Roc & Love</div>
        <div class="prize-title">${prizeTitle}</div>
        <div class="prize-description">${prizeDescription}</div>
        
        <div class="code-box">
          <div class="code-label">Code à utiliser lors de votre prochaine réservation&nbsp;:</div>
          <div class="code">${promoCode}</div>
        </div>
        
        <div class="validity">
          ⏰ Valable 6 mois sur une prochaine réservation directe Roc & Love
        </div>
      </div>
      
      <!-- Instructions -->
      <div class="instructions">
        <div class="instructions-title">💡 Comment utiliser votre code&nbsp;?</div>
        <ol style="margin: 0; padding-left: 18px;">
          <li>Rendez-vous sur <strong>www.rocandlove.fr</strong></li>
          <li>Choisissez vos dates de séjour</li>
          <li>Indiquez le code <strong>${promoCode}</strong> au moment de la réservation</li>
          <li>Validez… et profitez de votre avantage 🥂</li>
        </ol>
      </div>
      
      <!-- Bouton -->
      <div class="cta-wrapper">
        <a href="https://www.rocandlove.fr" class="cta-button" target="_blank" rel="noopener">
          Réserver mon prochain séjour <span>🏡</span>
        </a>
      </div>
      
      <p style="font-size: 15px; line-height: 1.6; margin-top: 24px;">
        On sera ravis de vous accueillir à nouveau pour un moment encore plus doux, encore plus vous. ❤️
      </p>
      
      <p style="font-size: 13px; color: #8B7355; margin-top: 18px; line-height: 1.5;">
        Gardez précieusement cet email&nbsp;: ce code est personnel et vous sera demandé lors de votre prochaine réservation.
      </p>
    </div>
    
    <!-- Pied de page -->
    <div class="footer">
      <p style="margin: 5px 0;">Roc & Love &mdash; Love room troglodytique à Rochecorbon</p>
      <p style="margin: 5px 0;">
        <a href="https://www.rocandlove.fr" target="_blank" rel="noopener">www.rocandlove.fr</a>
      </p>
      <p style="margin: 12px 0 4px 0; font-size: 11px; color: #777777;">
        Vous recevez cet email suite à votre séjour et à votre participation au jeu Roc & Love.
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
