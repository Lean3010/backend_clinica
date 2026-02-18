const User = require("../models/User");
const bcrypt = require("bcryptjs");

const crearAdmin = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;

    // Verificar si ya existe el admin
    const existeAdmin = await User.findOne({ email: adminEmail });

    if (existeAdmin) {
      console.log("✔ Admin ya existe!");
      return;
    }

    // password haseado
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, salt);

    //Crear admin
    const admin = new User({
      email: adminEmail,
      password: hashedPassword,
      nombre: process.env.ADMIN_NAME,
      rol: "admin",
      estado: "activo",
    });

    await admin.save(); //para que se guarde en la base de datos
    console.log("Admin creado exitosamente!");
  } catch (error) {
    console.error("Error al crear Admin: ", error.message);
  }
};

module.exports = crearAdmin;
