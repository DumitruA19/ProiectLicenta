const express = require('express');
const {
    createCerereConcediu,
    getAllCereriConcediu,
    updateCerereConcediu,
    deleteCerereConcediu,
} = require('../controllers/cereriConcediuController');

const router = express.Router();

// Rute pentru cererile de concediu
router.post('/', createCerereConcediu); // Adaugă o cerere de concediu
router.get('/', getAllCereriConcediu); // Obține toate cererile de concediu
router.put('/:id', updateCerereConcediu); // Actualizează o cerere de concediu
router.delete('/:id', deleteCerereConcediu); // Șterge o cerere de concediu

module.exports = router;
