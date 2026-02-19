const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  try {
    // 1. Extraer datos del body (lo que envía el frontend)
    const { nombre, email, password, rol, telefono, especialidad } = req.body;

    // 2. Validar si el usuario ya existe
    let user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ msg: "El usuario ya existe con ese email" });
    }

    // 3. Crear el nuevo usuario
    user = new User({
      nombre,
      email,
      password,
      telefono,
      rol: rol || "paciente", // Si no envían rol, es paciente por defecto
      especialidad: rol === "medico" ? especialidad : null,
      estado: rol === "medico" ? "pendiente" : "activo", //  solo si es medico debe ser pendiente
    });

    // 4. Encriptar la contraseña
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // 5. Guardar en la Base de Datos
    await user.save();

    // 6. Responder al frontend
    res.status(201).json({
      msg: `Registro exitoso.${rol === "medico" ? "Tu cuenta está pendiente de aprobación por un administrador." : ""}`,
      user: {
        id: user._id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol,
        estado: user.estado,
      },
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ msg: "Hubo un error en el servidor al intentar registrarse" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Verificar si el usuario existe
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ msg: "Credenciales inválidas (Email no encontrado)" });
    }

    // 2. Verificar la contraseña
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ msg: "Credenciales inválidas (Contraseña incorrecta)" });
    }

    // 3. Verificar si está ACTIVO
    if (user.estado !== "activo") {
      return res.status(403).json({
        msg: `Acceso denegado. Tu cuenta está en estado: '${user.estado}'. Espera a que un administrador te apruebe.`,
      });
    }

    // 4. Crear el Token (JWT)
    // Este "carnet" digital llevará el ID y el ROL del usuario
    const payload = {
      user: {
        id: user._id || user.id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol, // Importante para saber si es admin, medico o paciente
      },
    };

    // Firmar el token (expira en 1 día)
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    return res.json({
      token,
      user: {
        id: user._id || user.id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol,
      },
    });
  } catch (error) {
    console.error("ERROR LOGIN:", error.message);
    console.error(error.stack);
    res.status(500).json({
      msg: "Error en el servidor al iniciar sesión",
      error: error.message,
    });
  }
};
module.exports = {
  register,
  login,
};
