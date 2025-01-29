const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    ciphers: 'SSLv3'
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
    from: `"Stubits" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Welcome to Stubits! 🎓',
    html: `
      <div style="background-color: #0a0a0a; color: #ffffff; padding: 20px; font-family: Arial, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; text-align: center;">
          <h1 style="color: #9333ea;">Welcome to Stubits!</h1>
          <p style="color: #a0a0a0;">Thanks for joining our waiting list. We'll notify you when we launch!</p>
          <div style="background: linear-gradient(45deg, #9333ea, #7928ca); padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; color: #ffffff;">Get ready for a revolutionary study experience!</p>
          </div>
        </div>
      </div>
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

module.exports = { sendThankYouEmail };