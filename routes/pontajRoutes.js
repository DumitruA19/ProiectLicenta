const express = require('express');
const { createPontaj, getAllPontaj, deletePontaj } = require('../controllers/pontajController');

const router = express.Router();

// Rute pentru pontaj
router.post('/', createPontaj); // Adaugă pontaj
router.get('/', getAllPontaj); // Obține toate pontajele
router.delete('/:id', deletePontaj); // Șterge un pontaj

module.exports = router;
