const sequelize = require("sequelize");
const db = require("../models/db");
const Model = sequelize.Model;
const Usuario = require("./usuario").Usuarios;

class Notificaciones extends Model { }
Notificaciones.init(
  {
    id: {
      type: sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      unique: true
    },
    titulo: {
      type: sequelize.STRING,
      allowNull: false,
      notEmpty: true,
      validate: {
        notEmpty: {
          msg: "Debes de introducir un titulo a la notificacion."
        },
        notNull: {
          msg: "El valor introducido no puede ser nulo."
        }
      }
    },
    cuerpo: {
      type: sequelize.STRING(65000),
      allowNull: false,
      notEmpty: true,
      validate: {
        notEmpty: {
          msg: "Debes de introducir contenido para la notificacion."
        },
        notNull: {
          msg: "El valor introducido no puede ser nulo."
        }
      }
    },
  },
  { sequelize: db, freezeTableName: true }
);

Notificaciones.beforeCreate((notificacion, options) => {
  var message = {
    app_id: "9b7263ad-0b1b-4a8b-947c-430d5955058a",
    headings: { "en": notificacion.titulo },
    contents: { "en": notificacion.cuerpo },
    included_segments: ["All"]
  };
  sendNotification(message);
});

Usuario.hasMany(Notificaciones, { foreignKey: 'autor_id' });
Notificaciones.belongsTo(Usuario, { foreignKey: 'autor_id' });

var sendNotification = function (data) {
  var headers = {
    "Content-Type": "application/json; charset=utf-8",
    "Authorization": "Basic YzdjYzQwZWQtMGQ2Ni00MzQ2LTk4MGQtYWQzZGMxZjY5MTZj"
  };

  var options = {
    host: "onesignal.com",
    port: 443,
    path: "/api/v1/notifications",
    method: "POST",
    headers: headers
  };

  var https = require('https');
  var req = https.request(options, function (res) {
    res.on('data', function (data) {
    });
  });

  req.on('error', function (e) {
  });

  req.write(JSON.stringify(data));
  req.end();
};

module.exports = {
  Notificaciones
};
