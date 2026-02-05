const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
    try {
        // 1. Extraer datos del body (lo que envía el frontend)
        const { nombre, email, password, rol, telefono, especialidad } = req.body;

        // 2. Validar si el usuario ya existe
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'El usuario ya existe con ese email' });
        }

        // 3. Crear el nuevo usuario 
        user = new User({
            nombre,
            email,
            password,
            telefono,
            rol: rol || 'paciente', // Si no envían rol, es paciente por defecto
            especialidad: (rol === 'medico') ? especialidad : undefined,
            estado: 'pendiente' //  Nace pendiente de aprobación
        });

        // 4. Encriptar la contraseña 
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // 5. Guardar en la Base de Datos
        await user.save();

        // 6. Responder al frontend
        res.status(201).json({
            msg: 'Registro exitoso. Tu cuenta está pendiente de aprobación por un administrador.',
            user: {
                id: user._id,
                nombre: user.nombre,
                email: user.email,
                rol: user.rol,
                estado: user.estado
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Hubo un error en el servidor al intentar registrarse' });
    }
};
