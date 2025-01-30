const express = require('express');
const { createSediu, getAllSediu, updateSediu, deleteSediu } = require('../controllers/sediuController');
//const { protect } = require('../middleware/authMiddleware'); // Middleware pentru autentificare

const router = express.Router();

// Rute pentru sediu
/*router.post('/', protect, createSediu); // Creează un sediu nou
router.get('/', protect, getAllSediu); // Obține toate sediile
router.put('/:id', protect, updateSediu); // Actualizează un sediu
router.delete('/:id', protect, deleteSediu); // Șterge un sediu
*/

router.post('/', createSediu); // Creează un sediu nou
router.get('/',  getAllSediu); // Obține toate sediile
router.put('/:id', updateSediu); // Actualizează un sediu
router.delete('/:id', deleteSediu); // Șterge un sediu

module.exports = router;
