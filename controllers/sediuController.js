const { poolPromise } = require('../config/dbConfig');
const sql = require('mssql');

// Creează un sediu nou
const createSediu = async (req, res) => {
    const { name, location, judet } = req.body;

    if (!name || !location || !judet) {
        return res.status(400).json({ message: 'All fields are required: name, location, and judet' });
    }

    try {
        const pool = await poolPromise;
        await pool.request()
            .input('name', sql.NVarChar, name)
            .input('location', sql.NVarChar, location)
            .input('judet', sql.NVarChar, judet)
            .query(`
                INSERT INTO sediu (name, location, judet)
                VALUES (@name, @location, @judet)
            `);

        res.status(201).json({ message: 'Sediu created successfully' });
    } catch (error) {
        console.error('Error creating sediu:', error);
        res.status(500).json({ message: 'Server error while creating sediu' });
    }
};

// Obține toate sediile
const getAllSediu = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM sediu ORDER BY created_at DESC');

        res.status(200).json(result.recordset);
    } catch (error) {
        console.error('Error fetching sediu:', error);
        res.status(500).json({ message: 'Server error while fetching sediu' });
    }
};

// Verifică dacă un sediu există
const checkSediuExists = async (id) => {
    const pool = await poolPromise;
    const result = await pool.request()
        .input('id', sql.Int, id)
        .query('SELECT COUNT(*) AS count FROM sediu WHERE id = @id');

    return result.recordset[0].count > 0; // Returnează true dacă sediul există
};

// Actualizează un sediu
const updateSediu = async (req, res) => {
    const { id } = req.params;
    const { name, location, judet } = req.body;

    if (!id) {
        return res.status(400).json({ message: 'Sediu ID is required' });
    }

    try {
        // Verifică dacă sediul există
        const exists = await checkSediuExists(id);
        if (!exists) {
            return res.status(404).json({ message: 'Sediu not found' });
        }

        const pool = await poolPromise;
        await pool.request()
            .input('id', sql.Int, id)
            .input('name', sql.NVarChar, name || null)
            .input('location', sql.NVarChar, location || null)
            .input('judet', sql.NVarChar, judet || null)
            .query(`
                UPDATE sediu
                SET name = ISNULL(@name, name),
                    location = ISNULL(@location, location),
                    judet = ISNULL(@judet, judet)
                WHERE id = @id
            `);

        res.status(200).json({ message: 'Sediu updated successfully' });
    } catch (error) {
        console.error('Error updating sediu:', error);
        res.status(500).json({ message: 'Server error while updating sediu' });
    }
};

// Șterge un sediu
const deleteSediu = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: 'Sediu ID is required' });
    }

    try {
        // Verifică dacă sediul există
        const exists = await checkSediuExists(id);
        if (!exists) {
            return res.status(404).json({ message: 'Sediu not found' });
        }

        const pool = await poolPromise;
        await pool.request()
            .input('id', sql.Int, id)
            .query('DELETE FROM sediu WHERE id = @id');

        res.status(200).json({ message: 'Sediu deleted successfully' });
    } catch (error) {
        console.error('Error deleting sediu:', error);
        res.status(500).json({ message: 'Server error while deleting sediu' });
    }
};

module.exports = { createSediu, getAllSediu, updateSediu, deleteSediu };
