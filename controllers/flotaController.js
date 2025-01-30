const { poolPromise } = require('../config/dbConfig');
const sql = require('mssql');
const { containerClient } = require('../config/azureBlobConfig');
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');
const upload = multer(); // Middleware pentru gestionarea fișierelor

// Creează o mașină nouă
const createFlota = async (req, res) => {
    const { marca, model, nr_inmatriculare, serie_sasiu, sediu_id, fuel_type, status } = req.body;

    if (!marca || !model || !nr_inmatriculare || !serie_sasiu || !sediu_id || !fuel_type || !status) {
        console.error('Missing required fields:', { marca, model, nr_inmatriculare, serie_sasiu, sediu_id, fuel_type, status });
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        console.log('Start adding car:', { marca, model, nr_inmatriculare, serie_sasiu, sediu_id, fuel_type, status });

        const pool = await poolPromise;

        // Logare fișier imagine
        let imageUrl = null;
        if (req.file) {
            console.log('Uploading image...');
            imageUrl = await uploadImageToBlob(req.file);
            console.log('Image uploaded successfully:', imageUrl);
        }

        // Inserare în baza de date
        console.log('Inserting data into database...');
        await pool.request()
            .input('marca', sql.NVarChar, marca)
            .input('model', sql.NVarChar, model)
            .input('nr_inmatriculare', sql.NVarChar, nr_inmatriculare)
            .input('serie_sasiu', sql.NVarChar, serie_sasiu)
            .input('sediu_id', sql.Int, sediu_id)
            .input('fuel_type', sql.NVarChar, fuel_type)
            .input('status', sql.NVarChar, status)
            .input('image_url', sql.NVarChar, imageUrl)
            .query(`
                INSERT INTO flota (marca, model, nr_inmatriculare, serie_sasiu, sediu_id, fuel_type, status, image_url)
                VALUES (@marca, @model, @nr_inmatriculare, @serie_sasiu, @sediu_id, @fuel_type, @status, @image_url)
            `);

        console.log('Car added successfully');
        res.status(201).json({ message: 'Car added successfully' });
    } catch (error) {
        console.error('Error adding car:', error);
        res.status(500).json({ message: 'Server error while adding car' });
    }
};


// Obține toate mașinile
const getAllFlota = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM flota');

        res.status(200).json(result.recordset);
    } catch (error) {
        console.error('Error fetching cars:', error);
        res.status(500).json({ message: 'Server error while fetching cars' });
    }
};

// Actualizează o mașină
const updateFlota = async (req, res) => {
    const { id } = req.params;
    const { marca, model, nr_inmatriculare, serie_sasiu, fuel_type, status } = req.body;

    if (!id) {
        return res.status(400).json({ message: 'Car ID is required' });
    }

    try {
        const pool = await poolPromise;

        // Actualizează imaginea în Azure Blob Storage, dacă există
        let imageUrl = null;
        if (req.file) {
            imageUrl = await uploadImageToBlob(req.file);
        }

        // Actualizare date în baza de date
        await pool.request()
            .input('id', sql.Int, id)
            .input('marca', sql.NVarChar, marca || null)
            .input('model', sql.NVarChar, model || null)
            .input('nr_inmatriculare', sql.NVarChar, nr_inmatriculare || null)
            .input('serie_sasiu', sql.NVarChar, serie_sasiu || null)
            .input('fuel_type', sql.NVarChar, fuel_type || null)
            .input('status', sql.NVarChar, status || null)
            .input('image_url', sql.NVarChar, imageUrl || null)
            .query(`
                UPDATE flota
                SET marca = ISNULL(@marca, marca),
                    model = ISNULL(@model, model),
                    nr_inmatriculare = ISNULL(@nr_inmatriculare, nr_inmatriculare),
                    serie_sasiu = ISNULL(@serie_sasiu, serie_sasiu),
                    fuel_type = ISNULL(@fuel_type, fuel_type),
                    status = ISNULL(@status, status),
                    image_url = ISNULL(@image_url, image_url)
                WHERE id = @id
            `);

        res.status(200).json({ message: 'Car updated successfully' });
    } catch (error) {
        console.error('Error updating car:', error);
        res.status(500).json({ message: 'Server error while updating car' });
    }
};

// Șterge o mașină
const deleteFlota = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: 'Car ID is required' });
    }

    try {
        const pool = await poolPromise;

        // Ștergere din baza de date
        await pool.request()
            .input('id', sql.Int, id)
            .query('DELETE FROM flota WHERE id = @id');

        res.status(200).json({ message: 'Car deleted successfully' });
    } catch (error) {
        console.error('Error deleting car:', error);
        res.status(500).json({ message: 'Server error while deleting car' });
    }
};

// Încărcare imagine în Azure Blob Storage
const uploadImageToBlob = async (file) => {
    const blobName = `${uuidv4()}-${file.originalname}`;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    try {
        await blockBlobClient.uploadData(file.buffer, {
            blobHTTPHeaders: { blobContentType: file.mimetype },
        });
        return `https://${process.env.AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net/${process.env.AZURE_STORAGE_CONTAINER_NAME}/${blobName}`;
    } catch (error) {
        console.error('Error uploading image to Azure Blob Storage:', error.message);
        throw new Error('Failed to upload image');
    }
};

module.exports = { createFlota, getAllFlota, updateFlota, deleteFlota };
