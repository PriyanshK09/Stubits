const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Add verification
transporter.verify(function (error, success) {
  if (error) {
    console.log("SMTP server connection error:", error);
  } else {
    console.log("SMTP server connection successful");
  }
});

const sendThankYouEmail = async (email) => {
  const mailOptions = {
    from: {
      name: 'Stubits',
      address: 'welcome@stubits.com'
    },
    replyTo: 'welcome@stubits.com',
    to: email,
    subject: 'Welcome to the Future of Learning! 🚀',
    priority: 'high',
    headers: {
      'List-Unsubscribe': `<mailto:${process.env.EMAIL_USER}?subject=unsubscribe>`,
      'Precedence': 'bulk',
      'X-Auto-Response-Suppress': 'OOF, AutoReply',
      'X-Report-Abuse': `mailto:${process.env.EMAIL_USER}`,
      'X-Mailer': 'Stubits Mailer'
    },
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta name="color-scheme" content="light">
          <meta name="supported-color-schemes" content="light">
          <title>Welcome to Stubits</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: 'Inter', Arial, sans-serif;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto;">
            <tr>
              <td style="padding: 40px 20px; text-align: center;">
                <!-- Logo and Profile -->
                <div style="margin-bottom: 32px;">
                  <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-01-27%20at%2021.16.27_5fe7b30d-Photoroom-PGmOIIP1qxx8q6FGrmXjWeQ3tYTMFR.png" 
                       alt="Stubits Logo" 
                       style="width: 80px; height: 80px; border-radius: 50%; margin-bottom: 24px; border: 3px solid #9333ea;"
                  >
                  <h1 style="color: #ffffff; font-size: 32px; margin: 0;">Welcome to <span style="background: linear-gradient(45deg, #9333ea, #7928ca); -webkit-background-clip: text; background-clip: text; color: transparent;">Stubits</span></h1>
                </div>

                <!-- Main Content -->
                <div style="background: linear-gradient(180deg, rgba(147, 51, 234, 0.1), rgba(121, 40, 202, 0.1)); border-radius: 16px; padding: 32px; margin-bottom: 32px; border: 1px solid rgba(147, 51, 234, 0.2);">
                  <h2 style="color: #9333ea; font-size: 24px; margin: 0 0 16px;">You're In! 🎉</h2>
                  <p style="color: #a0a0a0; font-size: 16px; line-height: 1.6; margin: 0 0 24px;">Thanks for joining our exclusive waiting list. You're now part of a community that's redefining how students learn and succeed.</p>
                  
                  <!-- Feature Preview -->
                  <div style="text-align: left; margin: 32px 0;">
                    <h3 style="color: #ffffff; font-size: 18px; margin-bottom: 16px;">What's Coming:</h3>
                    <div style="color: #a0a0a0; font-size: 14px;">
                      ⚡ Smart Scheduling<br>
                      🧠 AI-Powered Learning<br>
                      🚀 Accelerated Progress<br>
                      📚 Interactive Study Materials
                    </div>
                  </div>

                  <!-- CTA Button -->
                  <a href="https://stubits.com" 
                     style="display: inline-block; background: linear-gradient(45deg, #9333ea, #7928ca); color: white; text-decoration: none; padding: 16px 32px; border-radius: 12px; font-weight: bold; margin: 24px 0;">
                    Visit Stubits
                  </a>
                </div>

                <!-- Social Links -->
                <div style="margin-top: 32px;">
                  <p style="color: #666666; font-size: 14px; margin-bottom: 16px;">Connect with us:</p>
                  <div>
                    <a href="https://x.com/StubitsOfficial" style="color: #9333ea; text-decoration: none; margin: 0 12px;">Twitter</a>
                    <a href="http://instagram.com/stubitsofficial" style="color: #9333ea; text-decoration: none; margin: 0 12px;">Instagram</a>
                    <a href="https://discord.gg/TpfNFRWnhd" style="color: #9333ea; text-decoration: none; margin: 0 12px;">Discord</a>
                  </div>
                </div>

                <!-- Footer -->
                <div style="margin-top: 48px; padding-top: 24px; border-top: 1px solid rgba(255, 255, 255, 0.1);">
                  <p style="color: #666666; font-size: 12px;">Made with 💜 for students</p>
                  <p style="color: #666666; font-size: 12px;">© 2025 Stubits. All rights reserved.</p>
                  <p style="color: #666666; font-size: 10px;">You received this email because you signed up for Stubits early access.</p>
                </div>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Email error:', error);
    throw new Error('Failed to send email');
  }
};

const sendPaymentStatusEmail = async (userEmail, userName, materialTitle, status, amount) => {
  const subject = status === 'approved' 
    ? '🎉 Payment Approved - Your Study Material is Ready!'
    : '❌ Payment Rejected - Action Required';

  const template = status === 'approved' 
    ? `
    <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #110C22; border-radius: 20px; border: 1px solid rgba(147, 51, 234, 0.2);">
      <div style="text-align: center; margin-bottom: 30px;">
        <img src="data:image/png;base64,${Buffer.from(require('fs').readFileSync('public/images/logo.png')).toString('base64')}" alt="Stubits Logo" style="width: 150px;">
      </div>
      <h2 style="color: #FFFFFF; margin-bottom: 20px; font-size: 24px; background: linear-gradient(135deg, #9333ea 0%, #7928ca 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Payment Approved! 🎉</h2>
      <div style="background: rgba(147, 51, 234, 0.1); border-radius: 16px; padding: 20px; margin-bottom: 20px; border: 1px solid rgba(147, 51, 234, 0.2);">
        <p style="color: #E2E8F0; line-height: 1.6;">Dear ${userName},</p>
        <p style="color: #E2E8F0; line-height: 1.6;">Your payment of ₹${amount} for "${materialTitle}" has been approved!</p>
        <p style="color: #E2E8F0; line-height: 1.6;">You can now access your study material from your dashboard.</p>
      </div>
      <div style="text-align: center; margin: 30px 0;">
        <a href="https://stubits.com/auth/signin?redirect=/dashboard" style="background: linear-gradient(135deg, #9333ea 0%, #7928ca 100%); color: white; padding: 12px 24px; text-decoration: none; border-radius: 12px; font-weight: 600; display: inline-block;">Access Your Material</a>
      </div>
      <p style="color: #94A3B8; font-size: 0.9em; text-align: center;">If you have any questions, feel free to reply to this email.</p>
      <hr style="border: 1px solid rgba(147, 51, 234, 0.1); margin: 20px 0;">
      <p style="color: #94A3B8; font-size: 0.8em; text-align: center;">© ${new Date().getFullYear()} Stubits. Made with 💜 for students</p>
    </div>
    `
    : `
    <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #110C22; border-radius: 20px; border: 1px solid rgba(239, 68, 68, 0.2);">
      <div style="text-align: center; margin-bottom: 30px;">
        <img src="data:image/png;base64,${Buffer.from(require('fs').readFileSync('public/images/logo.png')).toString('base64')}" alt="Stubits Logo" style="width: 150px;">
      </div>
      <h2 style="color: #FFFFFF; margin-bottom: 20px; font-size: 24px;">Payment Rejected ❌</h2>
      <div style="background: rgba(239, 68, 68, 0.1); border-radius: 16px; padding: 20px; margin-bottom: 20px; border: 1px solid rgba(239, 68, 68, 0.2);">
        <p style="color: #E2E8F0; line-height: 1.6;">Dear ${userName},</p>
        <p style="color: #E2E8F0; line-height: 1.6;">Your payment of ₹${amount} for "${materialTitle}" was rejected.</p>
        <ul style="color: #E2E8F0; line-height: 1.6;">
          <li>Incorrect UPI transaction details</li>
          <li>Payment amount mismatch</li>
          <li>Transaction verification failed</li>
        </ul>
      </div>
      <div style="text-align: center; margin: 30px 0;">
        <a href="https://stubits.com/auth/signin?redirect=/support" style="background: rgba(239, 68, 68, 0.2); color: #F87171; padding: 12px 24px; text-decoration: none; border-radius: 12px; font-weight: 600; border: 1px solid rgba(239, 68, 68, 0.3); display: inline-block;">Contact Support</a>
      </div>
      <p style="color: #94A3B8; font-size: 0.9em; text-align: center;">If you believe this is an error, please reply to this email.</p>
      <hr style="border: 1px solid rgba(239, 68, 68, 0.1); margin: 20px 0;">
      <p style="color: #94A3B8; font-size: 0.8em; text-align: center;">© ${new Date().getFullYear()} Stubits. Made with 💜 for students</p>
    </div>
    `;

  const mailOptions = {
    from: `Stubits <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: subject,
    html: template
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendThankYouEmail, sendPaymentStatusEmail };