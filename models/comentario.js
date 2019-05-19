const sequelize = require('sequelize');
const db = require('../models/db');
const Model = sequelize.Model;
const Noticia = require('./noticia').Noticias;
const Usuario = require('./usuario').Usuarios;

class Comentarios extends Model {}
  Comentarios.init({
    id: {
      type: sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      unique: true
    },
    cuerpo: {
      type: sequelize.STRING,
      allowNull: false,
      notEmpty: true,
      validate: {
        notEmpty: {
          msg: 'Debes de introducir un cuerpo en tu comentario.'
        },
        notNull: {
          msg: 'El valor introducido no puede ser nulo.'
        },
      }
    },
    noticia_id: {
      type: sequelize.INTEGER,
    },
    autor_id: {
        type: sequelize.INTEGER,
    },
}, { sequelize: db,
  freezeTableName: true,
});

Comentarios.associate = (models) => {
    Comentarios.belongsTo(models.Categoria.id, {foreignKey: 'noticia_id', as: 'Noticia'});
};
Comentarios.associate = (models) => {
    Comentarios.belongsTo(models.Usuario.id, {foreignKey: 'autor_id', as: 'Usuario'});
};

module.exports = {
    Comentarios,
}