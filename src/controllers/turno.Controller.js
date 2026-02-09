const Turno = require('../models/turno');


exports.crearTurno = async (req, res) => {
    try {
        const { medicoId, fecha, motivo } = req.body;

        // Crear el turno usando el ID del usuario logueado (req.user.id)
        const turno = new Turno({
            paciente: req.user.id, // Viene del middleware auth
            medico: medicoId,
            fecha,
            motivo
        });

        await turno.save();

        res.status(201).json({
            msg: 'Turno solicitado correctamente',
            turno
        });

    } catch (error) {
        console.error(error);
        res.status(500).send('Error al crear el turno');
    }
};


exports.obtenerTurnos = async (req, res) => {
    try {
        let turnos;

        // Si es MÉDICO, busca los turnos donde él es el médico
        if (req.user.rol === 'medico') {
            turnos = await Turno.find({ medico: req.user.id })
                .populate('paciente', 'nombre email') // Trae los datos del paciente automáticamente
                .sort({ fecha: 1 }); // Ordena por fecha ascendente
        } 
        // Si es PACIENTE, busca los turnos donde él es el paciente
        else {
            turnos = await Turno.find({ paciente: req.user.id })
                .populate('medico', 'nombre especialidad') // Trae los datos del médico
                .sort({ fecha: 1 });
        }

        res.json(turnos);

    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener los turnos');
    }
};