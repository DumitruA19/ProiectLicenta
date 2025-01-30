const { poolPromise } = require('../config/dbConfig');
const sql = require('mssql');
const { sendNotification } = require('./notificariController'); // Funcția pentru notificări

// Creează o cerere de concediu
const createCerereConcediu = async (req, res) => {
    const { user_id, type, start_date, end_date, reason, status } = req.body;

    if (!user_id || !type || !start_date || !end_date || !reason) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const pool = await poolPromise;

        await pool.request()
            .input('user_id', sql.Int, user_id)
            .input('type', sql.NVarChar, type)
            .input('start_date', sql.Date, start_date)
            .input('end_date', sql.Date, end_date)
            .input('reason', sql.NVarChar, reason)
            .input('status', sql.NVarChar, status || 'Pending')
            .query(`
                INSERT INTO cereri_concediu (user_id, type, start_date, end_date, reason, status)
                VALUES (@user_id, @type, @start_date, @end_date, @reason, @status)
            `);

        res.status(201).json({ message: 'Leave request created successfully' });
    } catch (error) {
        console.error('Error creating leave request:', error);
        res.status(500).json({ message: 'Server error while creating leave request' });
    }
};
/*const updateCerereConcediu = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!id || !status) {
        return res.status(400).json({ message: 'Request ID and status are required.' });
    }

    try {
        const pool = await poolPromise;

        // Obține detalii despre cerere și utilizator
        const cerereResult = await pool.request()
            .input('id', sql.Int, id)
            .query(`
                SELECT cc.*, u.email, u.name
                FROM cereri_concediu cc
                JOIN users u ON cc.user_id = u.id
                WHERE cc.id = @id
            `);

        if (cerereResult.recordset.length === 0) {
            return res.status(404).json({ message: 'Leave request not found.' });
        }

        const cerere = cerereResult.recordset[0];

        // Actualizează statusul cererii
        await pool.request()
            .input('id', sql.Int, id)
            .input('status', sql.NVarChar, status) // 'approved' sau 'rejected'
            .query(`
                UPDATE cereri_concediu
                SET status = @status
                WHERE id = @id
            `);

        // Trimite notificare prin email
        const emailSubject = `Cerere concediu ${status === 'approved' ? 'aprobată' : 'respinsă'}`;
        const emailMessage = `
            Salut ${cerere.name},

            Cererea ta de concediu din ${cerere.start_date} până în ${cerere.end_date} a fost ${status === 'approved' ? 'aprobată' : 'respinsă'}.

            Detalii cerere:
            - Tip concediu: ${cerere.type}
            - Motiv: ${cerere.reason || 'Nespecificat'}

            Mulțumim,
            Echipa Administrativă
        `;

        await sendNotification(cerere.user_id, 'email', emailMessage, emailSubject);

        res.status(200).json({ message: `Leave request ${status}` });
    } catch (error) {
        console.error('Error updating leave request status:', error);
        res.status(500).json({ message: 'Server error while updating leave request status' });
    }
};*/
// Obține toate cererile de concediu
const getAllCereriConcediu = async (req, res) => {
    try {
        const pool = await poolPromise;

        const result = await pool.request().query('SELECT * FROM cereri_concediu');

        res.status(200).json(result.recordset);
    } catch (error) {
        console.error('Error fetching leave requests:', error);
        res.status(500).json({ message: 'Server error while fetching leave requests' });
    }
};


// Actualizează o cerere de concediu
const updateCerereConcediu = async (req, res) => {
    const { id } = req.params;
    const { type, start_date, end_date, reason, status } = req.body;

    if (!id) {
        return res.status(400).json({ message: 'Leave request ID is required' });
    }

    try {
        const pool = await poolPromise;

        await pool.request()
            .input('id', sql.Int, id)
            .input('type', sql.NVarChar, type || null)
            .input('start_date', sql.Date, start_date || null)
            .input('end_date', sql.Date, end_date || null)
            .input('reason', sql.NVarChar, reason || null)
            .input('status', sql.NVarChar, status || null)
            .query(`
                UPDATE cereri_concediu
                SET type = ISNULL(@type, type),
                    start_date = ISNULL(@start_date, start_date),
                    end_date = ISNULL(@end_date, end_date),
                    reason = ISNULL(@reason, reason),
                    status = ISNULL(@status, status)
                WHERE id = @id
            `);

             // Trimite notificare prin email
        const emailSubject = `Cerere concediu ${status === 'approved' ? 'aprobată' : 'respinsă'}`;
        const emailMessage = `
            Salut ${cerere.name},

            Cererea ta de concediu din ${cerere.start_date} până în ${cerere.end_date} a fost ${status === 'approved' ? 'aprobată' : 'respinsă'}.

            Detalii cerere:
            - Tip concediu: ${cerere.type}
            - Motiv: ${cerere.reason || 'Nespecificat'}

            Mulțumim,
            Echipa Administrativă`;

        await sendNotification(cerere.user_id, 'email', emailMessage, emailSubject)

        res.status(200).json({ message: 'Leave request updated successfully' });
    } catch (error) {
        console.error('Error updating leave request:', error);
        res.status(500).json({ message: 'Server error while updating leave request' });
    }
    
};

// Șterge o cerere de concediu
const deleteCerereConcediu = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: 'Leave request ID is required' });
    }

    try {
        const pool = await poolPromise;

        await pool.request()
            .input('id', sql.Int, id)
            .query('DELETE FROM cereri_concediu WHERE id = @id');

        res.status(200).json({ message: 'Leave request deleted successfully' });
    } catch (error) {
        console.error('Error deleting leave request:', error);
        res.status(500).json({ message: 'Server error while deleting leave request' });
    }
};

module.exports = { createCerereConcediu, getAllCereriConcediu, updateCerereConcediu, deleteCerereConcediu };
