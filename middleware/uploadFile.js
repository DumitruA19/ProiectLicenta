const express = require('express');
const { createReparatie } = require('../controllers/reparatiiController');
const router = express.Router();

router.post('/', uploadFiles, createReparatie);
