const express = require("express");
const router = express.Router();
const { verifyAuth, verificarRol } = require("../middlewares/auth"); // Importamos el guardián
const {
  crearTurno,
  obtenerTurnos,
  cancelarTurno,
} = require("../controllers/turno.Controller");

// Todas estas rutas están protegidas (necesitas estar logueado)
router.post("/", verifyAuth, verificarRol("paciente"), crearTurno);
router.get("/", verifyAuth, verificarRol("paciente", "medico"), obtenerTurnos);
router.put("/:id", verifyAuth, verificarRol("medico"), cancelarTurno);

module.exports = router;
