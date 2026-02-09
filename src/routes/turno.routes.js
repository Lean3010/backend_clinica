const express = require('express');
const router = express.Router();
const turnoController = require('../controllers/turnoController');
const auth = require('../middlewares/auth'); // Importamos el guardián

// Todas estas rutas están protegidas (necesitas estar logueado)
router.post('/', auth, turnoController.crearTurno);
router.get('/', auth, turnoController.obtenerTurnos);
router.put('/:id/cancelar', auth, turnoController.cancelarTurno);
module.exports = router;