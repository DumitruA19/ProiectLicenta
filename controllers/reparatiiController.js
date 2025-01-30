const { poolPromise } = require('../config/dbConfig');
const sql = require('mssql');
const { containerClient } = require('../config/azureBlobConfig');
const { v4: uuidv4 } = require('uuid');
const { sendNotification } = require('./notificariController');

// Upload image to Azure Blob Storage
const uploadImageToBlob = async (file) => {
    const blobName = `${uuidv4()}-${file.originalname}`;
    console.log(`Uploading image: ${blobName}`);
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    try {
        await blockBlobClient.uploadData(file.buffer, {
            blobHTTPHeaders: { blobContentType: file.mimetype },
        });
        console.log(`Image uploaded successfully: ${blobName}`);
        return `https://${process.env.AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net/${process.env.AZURE_STORAGE_CONTAINER_NAME}/${blobName}`;
    } catch (error) {
        console.error('Error uploading image to Azure Blob Storage:', error.message);
        throw new Error('Failed to upload image');
    }
};

// Create a new repair
const createReparatie = async (req, res) => {
    console.log('Received request to create a new repair:', req.body);

    const { masina_id, user_id, start_date, end_date, status, parts_cost, manopera_cost } = req.body;

    if (!masina_id || !user_id || !start_date || !status) {
        console.log('Missing required fields:', req.body);
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        const pool = await poolPromise;
        console.log('Connected to the database');

        let newPartsImageUrl = null;
        let replacedPartsImageUrl = null;

        if (req.files?.newPartsImage?.[0]) {
            newPartsImageUrl = await uploadImageToBlob(req.files.newPartsImage[0]);
        }
        if (req.files?.replacedPartsImage?.[0]) {
            replacedPartsImageUrl = await uploadImageToBlob(req.files.replacedPartsImage[0]);
        }

        console.log('Executing INSERT query for a new repair');
        await pool.request()
            .input('masina_id', sql.Int, masina_id)
            .input('user_id', sql.Int, user_id)
            .input('start_date', sql.DateTime, start_date)
            .input('end_date', sql.DateTime, end_date || null)
            .input('status', sql.NVarChar, status)
            .input('new_parts_image_url', sql.NVarChar, newPartsImageUrl || null)
            .input('replaced_parts_image_url', sql.NVarChar, replacedPartsImageUrl || null)
            .input('parts_cost', sql.Float, parts_cost || 0)
            .input('manopera_cost', sql.Float, manopera_cost || 0)
            .query(`
                INSERT INTO reparatii (masina_id, user_id, start_date, end_date, status, 
                new_parts_image_url, replaced_parts_image_url, parts_cost, manopera_cost)
                VALUES (@masina_id, @user_id, @start_date, @end_date, @status, 
                @new_parts_image_url, @replaced_parts_image_url, @parts_cost, @manopera_cost)
            `);

        console.log('Repair added successfully');
        res.status(201).json({ message: 'Reparation added successfully' });
    } catch (error) {
        console.error('Error adding reparation:', error.message);
        res.status(500).json({ message: 'Server error while adding reparation' });
    }
};

// Get all repairs
const getAllReparatii = async (req, res) => {
    console.log('Received request to fetch all repairs');

    try {
        const pool = await poolPromise;
        console.log('Connected to the database');
        const result = await pool.request().query('SELECT * FROM reparatii');

        console.log('Fetched repairs:', result.recordset);
        res.status(200).json(result.recordset);
    } catch (error) {
        console.error('Error fetching reparations:', error.message);
        res.status(500).json({ message: 'Server error while fetching reparations' });
    }
};

// Update a repair
const updateReparatie = async (req, res) => {
    console.log('Received request to update a repair:', req.params, req.body);

    const { id } = req.params;
    const { status, parts_cost, manopera_cost } = req.body;

    if (!id) {
        console.log('Missing reparation ID in request');
        return res.status(400).json({ message: 'Reparation ID is required' });
    }

    try {
        const pool = await poolPromise;
        console.log('Connected to the database');

        let newPartsImageUrl = null;
        let replacedPartsImageUrl = null;

        if (req.files?.newPartsImage?.[0]) {
            newPartsImageUrl = await uploadImageToBlob(req.files.newPartsImage[0]);
        }
        if (req.files?.replacedPartsImage?.[0]) {
            replacedPartsImageUrl = await uploadImageToBlob(req.files.replacedPartsImage[0]);
        }

        console.log('Executing UPDATE query for repair with ID:', id);
        await pool.request()
            .input('id', sql.Int, id)
            .input('status', sql.NVarChar, status || null)
            .input('parts_cost', sql.Float, parts_cost || null)
            .input('manopera_cost', sql.Float, manopera_cost || null)
            .input('new_parts_image_url', sql.NVarChar, newPartsImageUrl || null)
            .input('replaced_parts_image_url', sql.NVarChar, replacedPartsImageUrl || null)
            .query(`
                UPDATE reparatii
                SET status = ISNULL(@status, status),
                    parts_cost = ISNULL(@parts_cost, parts_cost),
                    manopera_cost = ISNULL(@manopera_cost, manopera_cost),
                    new_parts_image_url = ISNULL(@new_parts_image_url, new_parts_image_url),
                    replaced_parts_image_url = ISNULL(@replaced_parts_image_url, replaced_parts_image_url)
                WHERE id = @id
            `);

        console.log('Repair updated successfully');
        res.status(200).json({ message: 'Reparation updated successfully' });
    } catch (error) {
        console.error('Error updating reparation:', error.message);
        res.status(500).json({ message: 'Server error while updating reparation' });
    }
};

// Delete a repair
const deleteReparatie = async (req, res) => {
    console.log('Received request to delete a repair:', req.params);

    const { id } = req.params;

    if (!id) {
        console.log('Missing reparation ID in request');
        return res.status(400).json({ message: 'Reparation ID is required' });
    }

    try {
        const pool = await poolPromise;
        console.log('Connected to the database');
        console.log('Executing DELETE query for repair with ID:', id);

        await pool.request()
            .input('id', sql.Int, id)
            .query('DELETE FROM reparatii WHERE id = @id');

        console.log('Repair deleted successfully');
        res.status(200).json({ message: 'Reparation deleted successfully' });
    } catch (error) {
        console.error('Error deleting reparation:', error.message);
        res.status(500).json({ message: 'Server error while deleting reparation' });
    }
};

// Handle repair approval
const handleReparatieApproval = async (req, res) => {
    console.log('Received request to handle repair approval:', req.params, req.body);

    const { id } = req.params; // ID-ul cererii de reparație
    const { user_id, request } = req.body; // Utilizatorul care face cererea și statusul aprobării

    if (!id || !user_id || !request) {
        console.log('Missing required fields:', req.params, req.body);
        return res.status(400).json({ message: 'Reparation ID, user ID, and request status are required.' });
    }

    if (!['Accept', 'Refused'].includes(request)) {
        console.log('Invalid request status:', request);
        return res.status(400).json({ message: 'Invalid request status. Use "Accept" or "Refused".' });
    }

    try {
        const pool = await poolPromise;
        console.log('Connected to the database');

        // Verificăm dacă cererea există și statusul este `Pending`
        const reparatieResult = await pool.request()
            .input('id', sql.Int, id)
            .query(`
                SELECT r.*, m.sediu_id
                FROM reparatii r
                JOIN masini m ON r.masina_id = m.id
                WHERE r.id = @id AND r.request = 'Pending'
            `);

        if (reparatieResult.recordset.length === 0) {
            console.log('No matching repair request found or already processed');
            return res.status(404).json({ message: 'Reparation request not found or already processed.' });
        }

        const reparatie = reparatieResult.recordset[0];
        console.log('Repair request details:', reparatie);

        // Verificăm rolul utilizatorului
        const userResult = await pool.request()
            .input('user_id', sql.Int, user_id)
            .query(`SELECT role FROM users WHERE id = @user_id`);

        if (userResult.recordset.length === 0) {
            console.log('User not found with ID:', user_id);
            return res.status(404).json({ message: 'User not found.' });
        }

        const userRole = userResult.recordset[0].role;
        console.log('User role:', userRole);

        if (userRole === 'mecanic') {
            console.log('Mechanic is approving/refusing the request.');

            // Actualizăm statusul cererii
            await pool.request()
                .input('id', sql.Int, id)
                .input('request', sql.NVarChar, request)
                .query(`UPDATE reparatii SET request = @request WHERE id = @id`);

            // Trimitem notificare administratorului
            const adminResult = await pool.request()
                .input('sediu_id', sql.Int, reparatie.sediu_id)
                .query(`SELECT email FROM users WHERE role = 'administrator_sediu' AND sediu_id = @sediu_id`);

            if (adminResult.recordset.length === 0) {
                console.log('No administrator found for the associated office:', reparatie.sediu_id);
                return res.status(404).json({ message: 'No administrator found for the associated office.' });
            }

            const adminEmail = adminResult.recordset[0].email;
            console.log('Sending notification to admin:', adminEmail);

            const notificationSubject = request === 'Accept' ? 'Reparație Aprobată' : 'Reparație Refuzată';
            const notificationMessage = request === 'Accept'
                ? `Reparația pentru mașina cu ID-ul ${reparatie.masina_id} a fost aprobată de mecanic.`
                : `Reparația pentru mașina cu ID-ul ${reparatie.masina_id} a fost refuzată de mecanic.`;

            await sendNotification(adminEmail, 'email', notificationMessage, notificationSubject);
        } else if (userRole === 'administrator_sediu') {
            console.log('Administrator is processing the approval.');

            // Admin-ul finalizează procesul
            await pool.request()
                .input('id', sql.Int, id)
                .input('status', sql.NVarChar, request === 'Accept' ? 'Approved' : 'Rejected')
                .query(`UPDATE reparatii SET status = @status WHERE id = @id`);
        } else {
            console.log('User does not have the required role:', userRole);
            return res.status(403).json({ message: 'You do not have permission to approve this request.' });
        }

        console.log('Repair approval processed successfully');
        res.status(200).json({
            message: `Reparation request successfully updated to "${request}".`,
        });
    } catch (error) {
        console.error('Error handling reparation approval:', error.message);
        res.status(500).json({ message: 'Server error while handling reparation approval.' });
    }
};



module.exports = {
    createReparatie,
    getAllReparatii,
    updateReparatie,
    deleteReparatie,
    handleReparatieApproval,
};
