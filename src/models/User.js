const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true, // No puede haber dos usuarios con el mismo email
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    telefono: {
        type: String,
        required: false
    },
    //  Roles del sistema 
    rol: {
        type: String,
        enum: ['paciente', 'medico', 'admin'], 
        default: 'paciente'
    },
    
    // Todo usuario nace 'pendiente' hasta que el admin lo aprueba
    estado: {
        type: String,
        enum: ['pendiente', 'activo', 'rechazado'],
        default: 'pendiente' 
    },
    // Campo exclusivo para médicos 
    especialidad: {
        type: String,
        required: function() { return this.rol === 'medico'; } 
    }
}, {
    timestamps: true // Agrega fecha de creación y actualización automática
});

module.exports = mongoose.model('User', UserSchema);