const express = require('express');
const { createReparatie, getAllReparatii, updateReparatie, deleteReparatie } = require('../controllers/reparatiiController');
const multer = require('multer');
const { handleReparatieApproval } = require('../controllers/reparatiiController');

// Configure Multer to handle specific fields for file upload
const upload = multer({
    limits: { fileSize: 5 * 1024 * 1024 }, // Set file size limit to 5MB
});

const uploadFiles = upload.fields([
    { name: 'newPartsImage', maxCount: 1 },
    { name: 'replacedPartsImage', maxCount: 1 },
]);

const router = express.Router();

// Define routes for repairs
router.post('/', uploadFiles, createReparatie); // Add a new reparation
router.get('/', getAllReparatii); // Get all reparations
router.put('/:id', uploadFiles, updateReparatie); // Update a reparation
router.delete('/:id', deleteReparatie); // Delete a reparation
router.post('/:id/approve', handleReparatieApproval);

module.exports = router;
