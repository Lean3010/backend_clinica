const User = require('../models/User');

const obtenerMedicos = async (req, res) => {
  try {
    const medicos = await User.find({ rol: 'medico', estado: 'activo' }).select('nombre especialidad email _id');
    res.json(medicos);
  } catch (error) {
    console.error(error);
        res.status(500).json({ msg: 'Hubo un error al obtener los médicos' });
    }
};
module.exports = {
  obtenerMedicos,
};