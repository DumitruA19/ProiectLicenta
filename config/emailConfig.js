const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', // Serverul SMTP (de exemplu, Gmail)
    port: 587,              // Portul pentru TLS
    secure: false,          // Folosește TLS
    auth: {
        user: process.env.EMAIL_USER,    // Emailul tău (de ex., admin@gmail.com)
        pass: process.env.EMAIL_PASS     // Parola sau tokenul aplicației
    }
});

// Funcție pentru a trimite email-uri
const sendEmail = async (to, subject, text) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER, // Expeditorul
            to, // Destinatarul
            subject, // Subiectul email-ului
            text, // Conținutul email-ului
        };

        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${to}`);
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send email');
    }
};

module.exports = sendEmail;
