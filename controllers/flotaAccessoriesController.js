const { poolPromise } = require('../config/dbConfig');
const sql = require('mssql');

// Add an accessory to a car
const addAccessoryToFlota = async (req, res) => {
    const { masina_id, accessory_id, is_checked } = req.body;

    if (!masina_id || !accessory_id || is_checked === undefined) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const pool = await poolPromise;

        await pool.request()
            .input('masina_id', sql.Int, masina_id)
            .input('accessory_id', sql.Int, accessory_id)
            .input('is_checked', sql.Bit, is_checked)
            .query(`
                INSERT INTO flota_accessories (masina_id, accessory_id, is_checked)
                VALUES (@masina_id, @accessory_id, @is_checked)
            `);

        res.status(201).json({ message: 'Accessory added to car successfully' });
    } catch (error) {
        console.error('Error adding accessory to car:', error);
        res.status(500).json({ message: 'Server error while adding accessory to car' });
    }
};

// Get all flota accessories
const getAllFlotaAccessories = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM flota_accessories');
        res.status(200).json(result.recordset);
    } catch (error) {
        console.error('Error fetching flota accessories:', error);
        res.status(500).json({ message: 'Server error while fetching flota accessories' });
    }
};


// Update the state of an accessory
const updateAccessoryForFlota = async (req, res) => {
    const { id } = req.params;
    const { is_checked } = req.body;

    if (!id || is_checked === undefined) {
        return res.status(400).json({ message: 'Accessory ID and is_checked are required' });
    }

    try {
        const pool = await poolPromise;

        await pool.request()
            .input('id', sql.Int, id)
            .input('is_checked', sql.Bit, is_checked)
            .query(`
                UPDATE flota_accessories
                SET is_checked = @is_checked
                WHERE id = @id
            `);

        res.status(200).json({ message: 'Accessory state updated successfully' });
    } catch (error) {
        console.error('Error updating accessory state:', error);
        res.status(500).json({ message: 'Server error while updating accessory state' });
    }
};


// Delete an accessory from a car
const deleteAccessoryFromFlota = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: 'Accessory ID is required' });
    }

    try {
        const pool = await poolPromise;

        await pool.request()
            .input('id', sql.Int, id)
            .query('DELETE FROM flota_accessories WHERE id = @id');

        res.status(200).json({ message: 'Accessory removed from car successfully' });
    } catch (error) {
        console.error('Error removing accessory from car:', error);
        res.status(500).json({ message: 'Server error while removing accessory from car' });
    }
};

module.exports = {
    addAccessoryToFlota,
    getAllFlotaAccessories,
    updateAccessoryForFlota,
    deleteAccessoryFromFlota
};
