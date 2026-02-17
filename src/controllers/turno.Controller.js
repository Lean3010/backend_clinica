const Turno = require("../models/turno");
const User = require("../models/User");

const crearTurno = async (req, res) => {
  try {
    const { medicoId, fecha, motivo } = req.body;

    // Crear el turno usando el ID del usuario logueado (req.user.id)
    const turno = new Turno({
      paciente: req.user.id, // Viene del middleware auth
      medico: medicoId,
      fecha,
      motivo,
    });

    await turno.save();

    res.status(201).json({
      msg: "Turno solicitado correctamente",
      turno,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al crear el turno");
  }
};

const obtenerTurnos = async (req, res) => {
  try {
    let turnos;

    // Si es MÉDICO, busca los turnos donde él es el médico
    if (req.user.rol === "medico") {
      turnos = await Turno.find({ medico: req.user.id })
        .populate("paciente", "nombre email") // Trae los datos del paciente automáticamente
        .sort({ fecha: 1 }); // Ordena por fecha ascendente
    }
    // Si es PACIENTE, busca los turnos donde él es el paciente
    else {
      turnos = await Turno.find({ paciente: req.user.id })
        .populate("medico", "nombre especialidad") // Trae los datos del médico
        .sort({ fecha: 1 });
    }

    res.json(turnos);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al obtener los turnos");
  }
};

const cancelarTurno = async (req, res) => {
  try {
    // 1. Buscar el turno por ID (que viene en la URL)
    const turno = await Turno.findById(req.params.id);

    if (!turno) {
      return res.status(404).json({ msg: "Turno no encontrado" });
    }

    // 2. Verificar que el usuario sea el dueño del turno (Paciente o Médico asignado)
    // Convertimos a string para poder comparar
    if (
      turno.paciente.toString() !== req.user.id &&
      turno.medico.toString() !== req.user.id
    ) {
      return res
        .status(401)
        .json({ msg: "No autorizado para cancelar este turno" });
    }

    // 3. Actualizar estado
    turno.estado = "cancelado";
    await turno.save();

    res.json({ msg: "Turno cancelado.", turno });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al cancelar el turno");
  }
};

module.exports = {
  crearTurno,
  obtenerTurnos,
  cancelarTurno,
};
