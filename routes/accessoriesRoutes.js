const express = require('express');
const {
    createAccessory,
    getAllAccessories,
    updateAccessory,
    deleteAccessory,
} = require('../controllers/accessoriesController');

const router = express.Router();

// Rute pentru accesorii
router.post('/', createAccessory); // Adaugă un accesoriu
router.get('/', getAllAccessories); // Obține toate accesoriile
router.put('/:id', updateAccessory); // Actualizează un accesoriu
router.delete('/:id', deleteAccessory); // Șterge un accesoriu

module.exports = router;
