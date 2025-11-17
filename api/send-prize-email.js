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
    
    <!-- Google Fonts - Cormorant -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cormorant:wght@400;700&display=swap" rel="stylesheet">
    
    <style>
        @font-face {
            font-family: 'Brittany Signature';
            src: url('https://rocandlove-lovebox.vercel.app/assets/BrittanySignature.ttf') format('truetype');
            font-weight: normal;
            font-style: normal;
        }
        
        body {
            margin: 0;
            padding: 0;
            background-color: #000000;
            font-family: Georgia, serif;
            color: #ffffff;
        }
        
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 40px 20px;
        }
        
        .logo {
            text-align: center;
            margin-bottom: 32px;
        }
        
        .logo img {
            width: 192px;
            height: auto;
            filter: drop-shadow(0 0 20px rgba(185, 163, 120, 0.3));
        }
        
        .card {
            background: linear-gradient(135deg, #1f1f1f 0%, #000000 100%);
            border: 1px solid rgba(139, 115, 85, 0.3);
            border-radius: 16px;
            padding: 40px 32px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }
        
        .heart-icon {
            text-align: center;
            margin-bottom: 24px;
            font-size: 64px;
        }
        
        .main-title {
            font-family: 'Brittany Signature', cursive;
            font-size: 64px;
            color: #DCD1BC;
            text-align: center;
            margin: 0 0 48px 0;
            letter-spacing: 0.05em;
            text-shadow: 0 0 40px rgba(220, 209, 188, 0.6), 0 0 20px rgba(220, 209, 188, 0.4);
        }
        
        .greeting {
            color: #d1d5db;
            text-align: center;
            margin-bottom: 32px;
            font-size: 18px;
            line-height: 1.75;
        }
        
        .prize-section {
            margin: 32px 0;
        }
        
        .prize-emoji {
            text-align: center;
            font-size: 40px;
            margin-bottom: 16px;
        }
        
        .prize-description {
            color: #B9A378;
            text-align: center;
            font-size: 18px;
            line-height: 1.75;
            margin-bottom: 32px;
            font-weight: bold;
        }
        
        .code-container {
            text-align: center;
            margin: 32px 0;
        }
        
        .code-box {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(to right, rgba(139, 115, 85, 0.3) 0%, rgba(139, 115, 85, 0.3) 100%);
            padding: 32px 32px;
            border-radius: 12px;
            border: 1px solid rgba(185, 163, 120, 0.5);
        }
        
        .code-text {
            font-size: 48px;
            font-weight: bold;
            color: #B9A378;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
            line-height: 1;
            letter-spacing: 0.1em;
        }
        
        .validity {
            text-align: center;
            color: #9ca3af;
            font-size: 14px;
            margin-top: 16px;
        }
        
        .cta-button {
            display: block;
            width: 100%;
            padding: 16px;
            border-radius: 12px;
            font-weight: 600;
            font-size: 18px;
            text-align: center;
            background: linear-gradient(135deg, #B9A378 0%, #8B7355 100%);
            color: #000000;
            text-decoration: none;
            letter-spacing: 0.05em;
            margin: 32px 0;
        }
        
        .final-message {
            color: #d1d5db;
            text-align: center;
            font-size: 16px;
            line-height: 1.75;
            margin: 32px 0;
        }
        
        .footer {
            text-align: center;
            color: #6b7280;
            font-size: 12px;
            margin-top: 40px;
        }
        
        .footer a {
            color: #B9A378;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Logo -->
        <div class="logo">
            <img src="https://rocandlove-lovebox.vercel.app/assets/logo.svg" alt="Roc & Love">
        </div>

        <!-- Card principale -->
        <div class="card">
            <!-- Icône cadeau -->
            <div class="heart-icon">
                🎁
            </div>
            
            <!-- Titre principal style Love Box -->
            <h1 class="main-title">Félicitations !</h1>

            <!-- Message de salutation -->
            <p class="greeting" style="font-size: 22px; color: #B9A378;">
                Bonjour ${clientName},
            </p>
            <p class="greeting">
                Merci infiniment pour votre séjour chez Roc & Love et pour votre précieux avis. 🙏
            </p>

            <!-- Section lot gagné -->
            <div class="prize-section">
                <div class="prize-emoji">${prizeEmoji}</div>
                <p class="prize-description">${prizeDescription}</p>
                <p style="text-align: center; color: #ffffff; font-size: 14px; margin-top: -20px; font-weight: normal;">lors de votre prochaine réservation</p>
            </div>

            <!-- Code promo -->
            <div class="code-container">
                <div class="code-box">
                    <div class="code-text">${promoCode}</div>
                </div>
                <p class="validity">⏰ Valable 6 mois</p>
            </div>

            <!-- Instructions -->
            <div style="background: rgba(185, 163, 120, 0.05); border-left: 4px solid #B9A378; padding: 20px; margin: 25px 0; color: #DCD1BC; font-family: 'Cormorant', Georgia, serif;">
                <strong style="color: #B9A378; font-size: 18px;">💡 Comment utiliser votre code ?</strong><br><br>
                1. Rendez-vous sur <strong>www.rocandlove.fr</strong><br>
                2. Choisissez vos dates de séjour<br>
                3. Saisissez le code <strong>${promoCode}</strong> lors de la réservation<br>
                4. Profitez de votre avantage ! ✨
            </div>

            <!-- Bouton CTA -->
            <a href="https://www.rocandlove.fr" class="cta-button">
                🏠 Réserver maintenant
            </a>

            <!-- Message final -->
            <p class="final-message">
                Nous avons hâte de vous accueillir à nouveau<br>
                pour un moment encore plus magique. 💛
            </p>
            
            <p style="text-align: center; color: #b9a368; font-size: 14px; margin-top: 20px;">
                Conservez bien cet email, vous en aurez besoin lors de votre prochaine réservation.
            </p>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p style="margin: 8px 0;">Roc & Love - Love Room à Rochecorbon</p>
            <p style="margin: 8px 0;">
                <a href="https://www.rocandlove.fr">www.rocandlove.fr</a>
            </p>
            <p style="margin: 20px 0 0 0;">
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
