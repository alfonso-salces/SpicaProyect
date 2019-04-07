const sequelize = require('sequelize');
const db = require('../models/db');
const Model = sequelize.Model;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


class Usuarios extends Model {}
  Usuarios.init({
    id: {
      type: sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nick: {
      type: sequelize.STRING,
      allowNull: false,
      notEmpty: true,
      validate: {
        notEmpty: {
          msg: 'Porfavor, introduce tu nick.'
        },
        notNull: {
          msg: 'El valor introducido no puede ser nulo.'
        },
      },
      unique: true
    },
    email: {
      type: sequelize.STRING,
      allowNull: false,
      notEmpty: true,
      validate: {
        notEmpty: {
          msg: 'Porfavor, introduce tu email.'
        },
        notNull: {
          msg: 'El valor introducido no puede ser nulo.'
        },
        isEmail: {
          msg: 'Porfavor, introduce tu email correctamente.'
        }
      },
      unique: true
    },
    password: {
      type: sequelize.STRING,
      allowNull: false,
      notEmpty: true,
      validate: {
        notEmpty: {
          msg: 'Debes introducir una contraseña.'
        },
        notNull: {
          msg: 'El valor introducido no puede ser nulo.'
        },
      }
    },
    nombre: {
      type: sequelize.STRING,
      allowNull: false,
      notEmpty: true,
      validate: {
        notEmpty: {
          msg: 'Debes de introducir un nombre de usuario.'
        },
        notNull: {
          msg: 'El valor introducido no puede ser nulo.'
        },
      }
    },
    image: {
      type: sequelize.STRING,
      allowNull: false,
      notEmpty: true,
      //defaultValue: 'default'
    },
    image_dir: {
      type: sequelize.STRING,
      allowNull: false,
      notEmpty: true,
      defaultValue: process.env.urlImagen
    },
    saltSecret: {
      type: sequelize.STRING
    },
}, { sequelize: db,
  freezeTableName: true,
});

Usuarios.beforeCreate((user, options) => {
  var salt = bcrypt.genSaltSync(10);
  var hash = bcrypt.hashSync(user.password, salt);
  user.password = hash;
  user.saltSecret = salt;
});

Usuarios.prototype.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = {
    Usuarios,
}