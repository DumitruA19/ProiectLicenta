// logsController.js

const poolPromise = require("../config/dbConfig");

// Creează un log
const createLog = async (req, res) => {
  const { user_id, action, details } = req.body;

  try {
    const pool = await poolPromise;
    await pool
      .request()
      .input("user_id", user_id)
      .input("action", action)
      .input("details", details)
      .query(
        "INSERT INTO logs (user_id, action, details, created_at) VALUES (@user_id, @action, @details, GETDATE())"
      );

    res.status(201).json({ message: "Log creat cu succes." });
  } catch (err) {
    console.error("Error creating log:", err);
    res.status(500).json({ error: err.message });
  }
};

// Obține toate logurile
const getAllLogs = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query("SELECT * FROM logs ORDER BY created_at DESC");
    res.status(200).json(result.recordset);
  } catch (err) {
    console.error("Error fetching logs:", err);
    res.status(500).json({ error: err.message });
  }
};

// Obține loguri pentru un utilizator
const getLogsByUserId = async (req, res) => {
  const { user_id } = req.params;

  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("user_id", user_id)
      .query("SELECT * FROM logs WHERE user_id = @user_id ORDER BY created_at DESC");

    res.status(200).json(result.recordset);
  } catch (err) {
    console.error("Error fetching logs by user ID:", err);
    res.status(500).json({ error: err.message });
  }
};

// Șterge logurile mai vechi de o anumită perioadă (ex: 60 de zile)
const deleteOldLogs = async (req, res) => {
  const { days } = req.params;

  try {
    const pool = await poolPromise;
    await pool
      .request()
      .input("days", days)
      .query(
        "DELETE FROM logs WHERE created_at < DATEADD(DAY, -@days, GETDATE())"
      );

    res.status(200).json({ message: `Logurile mai vechi de ${days} zile au fost șterse.` });
  } catch (err) {
    console.error("Error deleting old logs:", err);
    res.status(500).json({ error: err.message });
  }
};
const addLog = async (userId, action, details) => {
  try {
      const pool = await poolPromise;
      await pool.request()
          .input("user_id", userId)
          .input("action", action)
          .input("details", details)
          .query("INSERT INTO logs (user_id, action, details, created_at) VALUES (@user_id, @action, @details, GETDATE())");
  } catch (error) {
      console.error("Error adding log:", error);
  }
};


module.exports = {
  createLog,
  getAllLogs,
  getLogsByUserId,
  deleteOldLogs,
  addLog,
};
