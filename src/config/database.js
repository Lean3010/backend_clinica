// Conexion a la base de datos
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Conectado Exitosamente');
    } catch (error) {
        console.error('Error conectando a MongoDB:', error);
        process.exit(1); // Detiene la app si falla la DB
    }
};

module.exports = connectDB;