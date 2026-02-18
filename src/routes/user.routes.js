const express = require('express');
const router = express.Router();
const { obtenerMedicos } = require('../controllers/user.Controller');
const { verifyAuth } = require('../middlewares/auth'); 

router.get('/medicos', verifyAuth, obtenerMedicos);

module.exports = router;