/*const express = require('express');
const { createFlota, getAllFlota, updateFlota, deleteFlota } = require('../controllers/flotaController');
const { protect } = require('../middleware/authMiddleware');
const multer = require('multer');
const upload = multer();

const router = express.Router();

router.post('/', upload.single('image'), createFlota); // Creează o mașină nouă
router.get('/', protect, getAllFlota); // Obține toate mașinile
router.put('/:id', protect, upload.single('image'), updateFlota); // Actualizează o mașină
router.delete('/:id', protect, deleteFlota); // Șterge o mașină

module.exports = router;
*/
const express = require('express');
const { createFlota, getAllFlota, updateFlota, deleteFlota } = require('../controllers/flotaController');
const multer = require('multer');
const upload = multer();

const router = express.Router();

// Rute pentru mașini fără autentificare
router.post('/', upload.single('image'), createFlota); // Adaugă mașină
router.get('/', getAllFlota); // Obține toate mașinile
router.put('/:id', upload.single('image'), updateFlota); // Actualizează o mașină
router.delete('/:id', deleteFlota); // Șterge o mașină

module.exports = router;
