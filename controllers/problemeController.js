// ProblemeController.js
const poolPromise = require("../config/db");
const nodemailer = require("nodemailer");

// Raportează o problemă
const reportProblem = async (req, res) => {
    const { user_id, sediu_id, masina_id, descriere } = req.body;

    try {
        const pool = await poolPromise;

        // Înregistrează problema în baza de date
        const result = await pool.request()
            .input("user_id", user_id)
            .input("sediu_id", sediu_id)
            .input("masina_id", masina_id)
            .input("descriere", descriere)
            .query(
                "INSERT INTO probleme (user_id, sediu_id, masina_id, descriere) VALUES (@user_id, @sediu_id, @masina_id, @descriere)"
            );

        // Obține emailurile administratorului și mecanicului (exemplu simplificat)
        const adminEmail = "admin@example.com";
        const mecanicEmail = "mecanic@example.com";

        // Trimitere notificări prin email
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: `${adminEmail}, ${mecanicEmail}`,
            subject: "Problemă raportată",
            text: `O problemă a fost raportată: ${descriere}`
        });

        // Înregistrează notificări interne
        await pool.request()
            .input("recipient_id", null) // Poți seta ID-ul adminului/mecanicului aici
            .input("type", "Problema raportată")
            .input("message", `O problemă a fost raportată: ${descriere}`)
            .query(
                "INSERT INTO notificari (recipient_id, type, message, status) VALUES (@recipient_id, @type, @message, 'unread')"
            );

        res.status(201).json({ message: "Problemă raportată cu succes și notificare trimisă." });
    } catch (err) {
        console.error("Error reporting problem:", err);
        res.status(500).json({ error: err.message });
    }
};

// Obține problemele raportate pentru un sediu
const getProblemeBySediu = async (req, res) => {
    const { sediu_id } = req.params;

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input("sediu_id", sediu_id)
            .query(
                `SELECT p.id, p.descriere, p.status, u.name AS raportat_de, p.created_at
                 FROM probleme p
                 INNER JOIN users u ON p.user_id = u.id
                 WHERE p.sediu_id = @sediu_id
                 ORDER BY p.created_at DESC`
            );

        res.status(200).json(result.recordset);
    } catch (err) {
        console.error("Error fetching problems:", err);
        res.status(500).json({ error: err.message });
    }
};

module.exports = { reportProblem, getProblemeBySediu };
