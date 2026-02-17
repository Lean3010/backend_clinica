const express = require('express');
const router = express.Router();
const { verifyAdmin} = require('../middlewares/auth'); // Importamos el guardián
const { crearTurno, obtenerTurnos, cancelarTurno } = require('../controllers/turno.Controller');

// Todas estas rutas están protegidas (necesitas estar logueado)
router.post('/', verifyAdmin, crearTurno);
router.get('/', verifyAdmin, obtenerTurnos);
router.put('/:id', verifyAdmin, cancelarTurno);
module.exports = router;