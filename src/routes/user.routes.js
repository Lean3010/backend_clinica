const express = require("express");
const router = express.Router();
const {
  obtenerMedicos,
  aceptarMedico,
} = require("../controllers/user.Controller");
const { verifyAuth, verificarRol } = require("../middlewares/auth");

router.get("/medicos", verifyAuth, verificarRol("admin"), obtenerMedicos);
router.put(
  "/medico/:id/aceptar",
  verifyAuth,
  verificarRol("admin"),
  aceptarMedico,
);

module.exports = router;
