const sequelize = require('sequelize');
const db = require('../models/db');
const Model = sequelize.Model;
const Noticia = require('./noticia').Noticias;

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

Categorias.associate = (models) => {
  Categorias.hasMany(models.Noticias.id, {foreignKey: 'ID', as: 'Noticia'});
};

module.exports = {
    Categorias,
}