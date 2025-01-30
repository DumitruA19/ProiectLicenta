const nodemailer = require('nodemailer');
const moment = require('moment');

// 1) Configure Nodemailer
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER, // Gmail address (e.g., "example@gmail.com")
        pass: process.env.EMAIL_PASS, // App Password from Google
    },
});
