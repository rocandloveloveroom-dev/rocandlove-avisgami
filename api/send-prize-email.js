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
    body { margin:0; padding:0; background-color:#000; font-family: Georgia, serif; }
    .container { max-width:600px; margin:0 auto; background:#000; }
    .header { background: linear-gradient(135deg, #B9A378 0%, #8B7355 100%); text-align:center; padding:32px 20px; }
    .subtitle { margin-top:6px; font-size:12px; letter-spacing:0.12em; text-transform:uppercase; color:#3b2b13; font-family:Georgia,serif; }
    .content { padding:32px 26px 40px; color:#E8DFD0; font-size:15px; line-height:1.6; font-family:Georgia,serif; }
    .prize-box {
      background: rgba(185,163,120,0.10);
      border:2px solid #B9A378;
      border-radius:16px;
      padding:24px 20px;
      margin:28px 0;
      text-align:center;
    }
    .emoji { font-size:52px; margin-bottom:12px; }
    .prize-label { font-size:13px; color:#8B7355; letter-spacing:0.12em; text-transform:uppercase; }
    .prize-title { font-size:24px; color:#B9A378; margin:12px 0 10px; font-weight:bold; }
    .prize-description { font-size:15px; color:#F0E8D5; margin-bottom:16px; line-height:1.5; }
    .code-box {
      background:#000;
      border:2px solid #B9A378;
      border-radius:12px;
      padding:18px 12px;
      margin-top:12px;
    }
    .code-label { font-size:12px; color:#B9A378; letter-spacing:0.12em; margin-bottom:8px; text-transform:uppercase; }
    .code { font-family:"Courier New", monospace; font-size:26px; color:#B9A378; letter-spacing:0.35em; font-weight:bold; }
    .validity { font-size:13px; color:#8B7355; font-style:italic; margin-top:12px; }
    .instructions {
      background: rgba(185,163,120,0.05);
      border-left:4px solid #B9A378;
      padding:16px 18px;
      margin:24px 0;
      font-size:14px;
    }
    .instructions-title { color:#B9A378; font-weight:bold; margin-bottom:8px; }
    .cta-wrapper { text-align:center; margin:30px 0 10px; }
    .cta-button {
      display:inline-block;
      background: linear-gradient(135deg, #B9A378 0%, #8B7355 100%);
      color:#000;
      font-weight:bold;
      padding:15px 30px;
      border-radius:12px;
      text-decoration:none;
      font-size:16px;
    }
    .footer {
      text-align:center;
      padding:24px 24px 30px;
      color:#6a6a6a;
      font-size:12px;
      border-top:1px solid #333;
      font-family:Georgia,serif;
    }
    .footer a { color:#B9A378; text-decoration:none; }
    @media screen and (max-width:480px){
      .content { padding:26px 18px 34px; }
      .cta-button { width:100%; box-sizing:border-box; }
    }
  </style>
</head>
<body>

  <div class="container">

    <!-- HEADER -->
   <div class="header" style="
  background: #000000;
  padding: 36px 20px;
  text-align: center;
">
  <img src="https://gami.rocandlove.fr/assets/logo.svg"
       alt="Roc & Love"
       width="200"
       style="display:block;margin:0 auto 10px auto;">
  <div class="subtitle" style="color:#bfa067;">Love room • Rochecorbon</div>
</div>


    <!-- CONTENT -->
    <div class="content">

      <h2 style="color:#B9A378; font-size:22px; margin:0 0 16px 0; font-family:Georgia,serif;">
        Bonjour ${clientName} 💛
      </h2>

      <p>Merci pour votre séjour et pour le temps que vous avez pris pour laisser un avis.  
      Vos mots nous touchent énormément.</p>

      <p>Comme promis, voici le cadeau que vous avez gagné 🎁 :</p>

      <!-- PRIZE -->
      <div class="prize-box">
        <div class="emoji">${prizeEmoji}</div>
        <div class="prize-label">Votre cadeau Roc & Love</div>
        <div class="prize-title">${prizeTitle}</div>
        <div class="prize-description">${prizeDescription}</div>

        <div class="code-box">
          <div class="code-label">Votre code :</div>
          <div class="code">${promoCode}</div>
        </div>

        <div class="validity">⏰ Valable 6 mois sur une réservation directe</div>
      </div>

      <!-- HOW TO USE -->
      <div class="instructions">
        <div class="instructions-title">Comment utiliser votre code&nbsp;?</div>
        <ol style="margin:0; padding-left:18px;">
          <li>Rendez-vous sur <strong>www.rocandlove.fr</strong></li>
          <li>Choisissez vos dates de séjour</li>
          <li>Indiquez votre code <strong>${promoCode}</strong> lors de la réservation</li>
          <li>Profitez de votre avantage 🥂</li>
        </ol>
      </div>

      <!-- CTA -->
      <div class="cta-wrapper">
        <a href="https://www.rocandlove.fr"
           class="cta-button"
           target="_blank">
          Réserver un nouveau séjour 🏡
        </a>
      </div>

      <p style="margin-top:24px;">
        On espère avoir le plaisir de vous accueillir à nouveau pour un moment encore plus doux ✨
      </p>

      <p style="color:#8B7355; font-size:13px; margin-top:18px;">
        Conservez cet email : votre code est personnel et sera demandé lors de votre prochaine réservation.
      </p>

    </div>

    <!-- FOOTER -->
    <div class="footer">
      <p>Roc & Love — Love room troglodytique à Rochecorbon</p>
      <p><a href="https://www.rocandlove.fr">www.rocandlove.fr</a></p>
      <p style="margin-top:12px; color:#777; font-size:11px;">
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
