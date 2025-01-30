// notificariController.js

const poolPromise = require("../config/dbConfig");
const nodemailer = require("nodemailer");

// Creează o notificare
const createNotification = async (req, res) => {
  const { recipient_id, type, message } = req.body;

  try {
    const pool = await poolPromise;
    await pool
      .request()
      .input("recipient_id", recipient_id)
      .input("type", type)
      .input("message", message)
      .query(
        "INSERT INTO notificari (recipient_id, type, message, status) VALUES (@recipient_id, @type, @message, 'unread')"
      );

    res.status(201).json({ message: "Notificare creată cu succes." });
  } catch (err) {
    console.error("Error creating notification:", err);
    res.status(500).json({ error: err.message });
  }
};

// Obține notificările pentru un utilizator
const getNotifications = async (req, res) => {
  const { recipient_id } = req.params;

  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("recipient_id", recipient_id)
      .query(
        "SELECT id, recipient_id, type, message, status, created_at FROM notificari WHERE recipient_id = @recipient_id"
      );

    res.status(200).json(result.recordset);
  } catch (err) {
    console.error("Error fetching notifications:", err);
    res.status(500).json({ error: err.message });
  }
};

// Trimite o notificare prin email
const sendNotificationEmail = async (req, res) => {
  const { recipient_email, subject, message } = req.body;

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // false pentru port 587
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: recipient_email,
    subject,
    text: message,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Email trimis cu succes." });
  } catch (err) {
    console.error("Error sending email:", err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createNotification,
  getNotifications,
  sendNotificationEmail,
};


