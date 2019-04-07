// Comprobamos el entorno.
var env = process.env.NODE_ENV || 'development';

// Configuramos el entorno con el archivo "config.json".
var config = require('./config.json');
var envConfig = config[env];

// Añadimos los valores de configuración al entorno.
Object.keys(envConfig).forEach(key => process.env[key] = envConfig[key]);