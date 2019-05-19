const sequelize = require("sequelize");
const db = require("../models/db");
const Model = sequelize.Model;
const Usuario = require("./usuario").Usuarios;

class Notificaciones extends Model {}
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
    autor_id: {
      type: sequelize.INTEGER
    }
  },
  { sequelize: db, freezeTableName: true }
);

Notificaciones.associate = models => {
  Notificaciones.belongsTo(models.Usuario.id, {
    foreignKey: "autor_id",
    as: "Usuario"
  });
};

module.exports = {
  Notificaciones
};