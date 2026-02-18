const express = require("express");
const router = express.Router();
const { verifyAuth, verificarRol } = require("../middlewares/auth"); // Importamos el guardián
const {
  crearTurno,
  obtenerTurnos,
  cancelarTurno,
  confirmarTurno,
} = require("../controllers/turno.Controller");

// Todas estas rutas están protegidas (necesitas estar logueado)
router.post("/", verifyAuth, verificarRol("paciente"), crearTurno);
router.get("/", verifyAuth, verificarRol("paciente", "medico"), obtenerTurnos);
router.put("/:id/cancelar", verifyAuth, verificarRol("medico"), cancelarTurno);
router.put("/:id/confirmar", verifyAuth, verificarRol("medico"), confirmarTurno);
module.exports = router;
