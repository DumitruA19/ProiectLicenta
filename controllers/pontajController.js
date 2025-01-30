const { poolPromise } = require('../config/dbConfig');
const sql = require('mssql');

const createPontaj = async (req, res) => {
    const { user_id, masina_id, type, start_time, end_time, km_start, km_end, fuel_used } = req.body;

    if (!user_id || !masina_id || !type || !start_time || !end_time || !km_start || !km_end || !fuel_used) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const pool = await poolPromise;

        // Reset IDENTITY if the table is empty
        await resetPontajIdentityIfEmpty(pool);

        await pool.request()
            .input('user_id', sql.Int, user_id)
            .input('masina_id', sql.Int, masina_id)
            .input('type', sql.NVarChar, type)
            .input('start_time', sql.DateTime, start_time)
            .input('end_time', sql.DateTime, end_time)
            .input('km_start', sql.Int, km_start)
            .input('km_end', sql.Int, km_end)
            .input('fuel_used', sql.Float, fuel_used)
            .query(`
                INSERT INTO pontaj (user_id, masina_id, type, start_time, end_time, km_start, km_end, fuel_used)
                VALUES (@user_id, @masina_id, @type, @start_time, @end_time, @km_start, @km_end, @fuel_used)
            `);

        res.status(201).json({ message: 'Pontaj created successfully' });
    } catch (error) {
        console.error('Error creating pontaj:', error);
        res.status(500).json({ message: 'Server error while creating pontaj' });
    }
};


// Obține toate pontajele
const getAllPontaj = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM pontaj');

        res.status(200).json(result.recordset);
    } catch (error) {
        console.error('Error fetching pontaj:', error);
        res.status(500).json({ message: 'Server error while fetching pontaj' });
    }
};

// Șterge un pontaj
const deletePontaj = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: 'Pontaj ID is required' });
    }

    try {
        const pool = await poolPromise;

        await pool.request()
            .input('id', sql.Int, id)
            .query('DELETE FROM pontaj WHERE id = @id');

        res.status(200).json({ message: 'Pontaj deleted successfully' });
    } catch (error) {
        console.error('Error deleting pontaj:', error);
        res.status(500).json({ message: 'Server error while deleting pontaj' });
    }
};
//Resetare Pontaj 
const resetPontajIdentityIfEmpty = async (pool) => {
    try {
        const result = await pool.request().query('SELECT COUNT(*) AS count FROM pontaj');
        if (result.recordset[0].count === 0) {
            console.log('Table is empty. Resetting IDENTITY...');
            await pool.request().query("DBCC CHECKIDENT ('pontaj', RESEED, 0)");
        }
    } catch (error) {
        console.error('Error resetting IDENTITY:', error);
    }
};

module.exports = { createPontaj, getAllPontaj, deletePontaj };
