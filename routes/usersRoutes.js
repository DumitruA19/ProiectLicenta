const express = require('express');
const { getAllUsers, createUser, loginUser, updateUser, deactivateUser, deleteUser } = require('../controllers/usersController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Rutele pentru utilizatori
router.get('/', protect, getAllUsers); // Protejată: Obține toți utilizatorii
router.post('/', createUser); // Creează un utilizator nou, fără protecție
router.post('/login', loginUser); // Protejată: Autentificare utilizator
router.put('/:id', protect, updateUser); // Protejată: Actualizează un utilizator
router.delete('/:id', protect, deactivateUser); // Protejată: Dezactivează un utilizator (sau putem folosi deleteUser pentru a șterge definitiv)
router.delete('/delete/:id', protect, deleteUser); // Protejată: Șterge un utilizator definitiv

module.exports = router;
