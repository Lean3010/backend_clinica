const express = require('express');
require("dotenv").config()
const cors = require('cors');
const connectDB = require('./config/database');
const morgan = require('morgan');

// Importar los archivos de los enrutadores
const authRoutes = require('./routes/auth.routes');
const turnoRoutes = require('./routes/turno.routes');
const userRoutes = require('./routes/user.routes');


// Conectar a la base de datos
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// RUTAS
app.use('/api/auth', authRoutes);
app.use('/api/turnos', turnoRoutes);
app.use('/api/users', userRoutes);

// PUERTO
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});