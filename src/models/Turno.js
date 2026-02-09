const moongose = require('mongoose');

const turnoSchema = new moongose.Schema({
    paciente: {
        type: moongose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    medico: {
        type: moongose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // fecha y hora exacta del turno
    fecha: {
        type: Date,
        required: true
    },
    motivo: {
        type: String,
        required: true,
        trim: true
    },
    estado: {
        type: String,
        enum: ['pendiente', 'confirmado', 'cancelado', 'completado'],
        default: 'pendiente'
    }
}, { timestamps: true }); // para saber cuándo se creó o actualizó el turno

module.exports = moongose.model('Turno', turnoSchema);