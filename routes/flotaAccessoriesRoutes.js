const express = require('express');
const {
    addAccessoryToFlota,
    getAllFlotaAccessories,
    updateAccessoryForFlota,
    deleteAccessoryFromFlota,
} = require('../controllers/flotaAccessoriesController');

const router = express.Router();

// Rute pentru legarea accesoriilor de mașini
router.post('/', addAccessoryToFlota); // Adaugă accesoriu la mașină
router.get('/:masina_id',getAllFlotaAccessories); // Obține accesoriile pentru o mașină
router.put('/:id', updateAccessoryForFlota); // Actualizează starea accesoriului
router.delete('/:id', deleteAccessoryFromFlota); // Șterge un accesoriu pentru o mașină

module.exports = router;
