const sequelize = require('sequelize');
const db = require('../models/db');
const Model = sequelize.Model;

class Categorias extends Model {}
  Categorias.init({
    id: {
      type: sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      unique: true
    },
    nombre: {
      type: sequelize.STRING,
      allowNull: false,
      notEmpty: true,
      validate: {
        notEmpty: {
          msg: 'Debes de introducir un nombre de categoría.'
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
}, { sequelize: db,
  freezeTableName: true,
});

module.exports = {
    Categorias,
}