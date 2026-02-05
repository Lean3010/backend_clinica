const express = require('express');
require("dotenv").config()
const cors = require('cors');
const connectDB = require('./config/database');
const morgan = require('morgan');

// Conectar a la base de datos
connectDB();

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});