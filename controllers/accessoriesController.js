const { poolPromise } = require('../config/dbConfig');
const sql = require('mssql');

// Creează un accesoriu nou
const createAccessory = async (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ message: 'Name is required' });
    }

    try {
        const pool = await poolPromise;

        await pool.request()
            .input('name', sql.NVarChar, name)
            .query('INSERT INTO accessories (name) VALUES (@name)');

        res.status(201).json({ message: 'Accessory created successfully' });
    } catch (error) {
        console.error('Error creating accessory:', error);
        res.status(500).json({ message: 'Server error while creating accessory' });
    }
};

// Obține toate accesoriile
const getAllAccessories = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM accessories');

        res.status(200).json(result.recordset);
    } catch (error) {
        console.error('Error fetching accessories:', error);
        res.status(500).json({ message: 'Server error while fetching accessories' });
    }
};

// Actualizează un accesoriu
const updateAccessory = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    if (!id || !name) {
        return res.status(400).json({ message: 'Accessory ID and name are required' });
    }

    try {
        const pool = await poolPromise;

        await pool.request()
            .input('id', sql.Int, id)
            .input('name', sql.NVarChar, name)
            .query('UPDATE accessories SET name = @name WHERE id = @id');

        res.status(200).json({ message: 'Accessory updated successfully' });
    } catch (error) {
        console.error('Error updating accessory:', error);
        res.status(500).json({ message: 'Server error while updating accessory' });
    }
};

// Șterge un accesoriu
const deleteAccessory = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: 'Accessory ID is required' });
    }

    try {
        const pool = await poolPromise;

        await pool.request()
            .input('id', sql.Int, id)
            .query('DELETE FROM accessories WHERE id = @id');

        res.status(200).json({ message: 'Accessory deleted successfully' });
    } catch (error) {
        console.error('Error deleting accessory:', error);
        res.status(500).json({ message: 'Server error while deleting accessory' });
    }
};

module.exports = { createAccessory, getAllAccessories, updateAccessory, deleteAccessory };
