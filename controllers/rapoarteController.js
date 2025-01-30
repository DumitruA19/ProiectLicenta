
const poolPromise = require("../config/db");

// Creează un raport
const createRaport = async (req, res) => {
  const { name, content, created_by } = req.body;

  try {
    const pool = await poolPromise;
    await pool
      .request()
      .input("name", name)
      .input("content", content)
      .input("created_by", created_by)
      .query(
        "INSERT INTO rapoarte (name, content, created_by, created_at) VALUES (@name, @content, @created_by, GETDATE())"
      );

    res.status(201).json({ message: "Raport creat cu succes." });
  } catch (err) {
    console.error("Error creating raport:", err);
    res.status(500).json({ error: err.message });
  }
};

// Obține toate rapoartele
const getAllRapoarte = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query("SELECT * FROM rapoarte");
    res.status(200).json(result.recordset);
  } catch (err) {
    console.error("Error fetching rapoarte:", err);
    res.status(500).json({ error: err.message });
  }
};

// Obține un raport după ID
const getRaportById = async (req, res) => {
  const { id } = req.params;

  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("id", id)
      .query("SELECT * FROM rapoarte WHERE id = @id");

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "Raportul nu a fost găsit." });
    }

    res.status(200).json(result.recordset[0]);
  } catch (err) {
    console.error("Error fetching raport by ID:", err);
    res.status(500).json({ error: err.message });
  }
};

// Șterge un raport
const deleteRaport = async (req, res) => {
  const { id } = req.params;

  try {
    const pool = await poolPromise;
    const result = await pool
      .request()
      .input("id", id)
      .query("DELETE FROM rapoarte WHERE id = @id");

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: "Raportul nu a fost găsit." });
    }

    res.status(200).json({ message: "Raport șters cu succes." });
  } catch (err) {
    console.error("Error deleting raport:", err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createRaport,
  getAllRapoarte,
  getRaportById,
  deleteRaport,
};
