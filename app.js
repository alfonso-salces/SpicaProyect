require('./config/config');
require('./models/db');

const morgan = require('morgan');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const exphbs = require('express-handlebars');

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
app.use(bodyParser.urlencoded({extended:true}));
app.use(cors());
app.use('/api', rtsIndex);

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