const User = require("../models/User");

const obtenerMedicos = async (req, res) => {
  try {
    const medicos = await User.find({ rol: "medico" }).select(
      "nombre especialidad email estado rol",
    );

    res.json(medicos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Hubo un error al obtener los médicos" });
  }
};

const aceptarMedico = async (req, res) => {
  try {
    const medico = await User.findById(req.params.id);

    if (!medico) {
      return res.status(404).json({ msg: "Doctor/a no encontrado" });
    }

    medico.estado = "activo";
    await medico.save();

    res.json({ msg: "Doctor/a aceptado!", medico });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error al aceptar" });
  }
};

module.exports = {
  obtenerMedicos,
  aceptarMedico,
};
