import { Resend } from 'resend';

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
    const { clientName, clientEmail, prizeEmoji, prizeTitle, prizeDescription, promoCode } = req.body;

    if (!clientEmail || !prizeTitle || !promoCode) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Initialiser Resend avec la clé API
    const resend = new Resend(process.env.RESEND_API_KEY);

    // Construire l'email HTML avec les couleurs Roc & Love
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { 
            margin: 0; 
            padding: 0; 
            font-family: Georgia, serif; 
            background-color: #000000;
          }
          .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: linear-gradient(135deg, #1a1a1a 0%, #000000 100%);
            border: 2px solid #B9A378;
            border-radius: 16px;
          }
          .header { 
            text-align: center; 
            padding: 40px 20px 20px; 
            background: linear-gradient(135deg, rgba(185,163,120,0.1) 0%, rgba(79,60,35,0.1) 100%);
            border-radius: 16px 16px 0 0;
          }
          .logo { 
            font-family: 'Brittany Signature', cursive; 
            font-size: 48px; 
            color: #B9A378; 
            margin: 0;
          }
          .emoji { 
            font-size: 80px; 
            margin: 20px 0;
          }
          .content { 
            padding: 40px 30px; 
            color: #DCD1BC;
          }
          .title { 
            font-size: 28px; 
            color: #B9A378; 
            text-align: center; 
            margin: 0 0 20px;
            font-weight: bold;
          }
          .description { 
            font-size: 18px; 
            text-align: center; 
            color: #ffffff; 
            margin: 0 0 30px;
            line-height: 1.6;
          }
          .code-box { 
            background: linear-gradient(135deg, #B9A378 0%, #8B7355 100%);
            border-radius: 12px; 
            padding: 30px; 
            text-align: center; 
            margin: 30px 0;
            box-shadow: 0 8px 16px rgba(185,163,120,0.3);
          }
          .code-label { 
            font-size: 14px; 
            color: #000000; 
            margin: 0 0 10px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          .code { 
            font-size: 36px; 
            font-weight: bold; 
            color: #000000;
            font-family: 'Courier New', monospace;
            letter-spacing: 4px;
            margin: 0;
          }
          .validity { 
            font-size: 12px; 
            color: #4F3C23; 
            margin: 15px 0 0;
            font-style: italic;
          }
          .footer { 
            text-align: center; 
            padding: 30px; 
            color: #8B7355; 
            font-size: 14px; 
            border-top: 1px solid #4F3C23;
          }
          .website { 
            color: #B9A378; 
            text-decoration: none; 
            font-weight: bold;
          }
          .info-box {
            background: rgba(185,163,120,0.1);
            border: 1px solid #4F3C23;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 class="logo">Roc & Love</h1>
            <div class="emoji">${prizeEmoji}</div>
          </div>
          
          <div class="content">
            <h2 class="title">Merci ${clientName} ! 🎉</h2>
            <p class="description">
              Voici votre cadeau pour avoir partagé votre expérience au Roc & Love.
            </p>
            
            <div class="info-box">
              <p style="margin: 0; font-size: 16px; color: #DCD1BC;">
                <strong>Votre cadeau :</strong><br>
                ${prizeTitle}<br>
                <span style="font-size: 14px; color: #8B7355;">${prizeDescription}</span>
              </p>
            </div>
            
            <div class="code-box">
              <p class="code-label">Votre code promo unique</p>
              <p class="code">${promoCode}</p>
              <p class="validity">⏰ Valable 6 mois</p>
            </div>
            
            <div class="info-box">
              <p style="margin: 0; font-size: 14px; color: #DCD1BC;">
                💻 Saisissez ce code lors de votre prochaine réservation sur<br>
                <a href="https://www.rocandlove.fr" class="website">www.rocandlove.fr</a>
              </p>
            </div>
          </div>
          
          <div class="footer">
            <p style="margin: 0 0 10px;">Nous avons hâte de vous accueillir à nouveau ! 💝</p>
            <p style="margin: 0;">
              <a href="https://www.rocandlove.fr" class="website">www.rocandlove.fr</a>
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Envoyer l'email via Resend
    const data = await resend.emails.send({
      from: 'Roc & Love <onboarding@resend.dev>',
      to: [clientEmail],
      subject: `${prizeEmoji} Votre code promo Roc & Love : ${promoCode}`,
      html: emailHtml,
    });

    res.status(200).json({ 
      success: true, 
      messageId: data.id 
    });

  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ 
      error: 'Failed to send email',
      details: error.message 
    });
  }
}
