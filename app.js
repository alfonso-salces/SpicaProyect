require('./config/config');
require('./models/db');

const { randomNumber } = require('./helpers/libs');

const morgan = require('morgan');
const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');

const rtsIndex = require('./routes/index.router');

// Base de datos
const db = require('./models/db');
db.authenticate()
  .then(() => {
    console.log('Conexión con SQLite establecida con éxito.');
  })
  .catch(err => {
    console.error('No se puede conectar con la base de datos:', err);
  });
db.sync();

// Inicializo express
var app = express();

// Middlewares utilizados
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(cors());

const storage = multer.diskStorage({
  destination: path.join(__dirname, process.env.urlImagen),
  limits: { fileSize: 10 * 1024 * 1024 },
  filename: (req, file, cb, filename) => {
    var extension = (path.extname(file.originalname).split(".")[1]);
    if(extension == 'jpg' || extension == 'jpeg' || extension == 'png') {
      cb(null, randomNumber() + path.extname(file.originalname));
    }
  },
});

app.use(multer({storage}).single('image'));
app.use(rtsIndex);

// Control de errores
app.use((err, req, res, next) => {
    if (err.name === 'ValidationError') {
        var valErrors = [];
        Object.keys(err.errors).forEach(key => valErrors.push(err.errors[key].message));
        res.status(422).send(valErrors)
    }
    else{
        console.log(err);
    }
});

// Archivos estáticos
app.use('/public', express.static(path.join(__dirname, 'public')));

// Iniciar la escucha del servidor
app.listen(process.env.PORT, () => console.log(`Servidor iniciado en el puerto : ${process.env.PORT}`));