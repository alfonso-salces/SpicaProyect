const sequelize = require('sequelize');
const db = require('../models/db');
const Model = sequelize.Model;
const Categoria = require('./categoria').Categorias;
const Usuario = require('./usuario').Usuarios;

class Noticias extends Model {}
  Noticias.init({
    id: {
      type: sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      unique: true
    },
    titular: {
      type: sequelize.STRING,
      allowNull: false,
      notEmpty: true,
      validate: {
        notEmpty: {
          msg: 'Debes de introducir un titular de noticia.'
        },
        notNull: {
          msg: 'El valor introducido no puede ser nulo.'
        },
      }
    },
    contenido: {
        type: sequelize.STRING(65000),
        allowNull: false,
        notEmpty: true,
        validate: {
          notEmpty: {
            msg: 'Debes de introducir contenido para tu noticia.'
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
    categoria_id: {
      type: sequelize.INTEGER,
    },
    autor_id: {
        type: sequelize.INTEGER,
    },
}, { sequelize: db,
  freezeTableName: true,
});

Noticias.associate = (models) => {
    Noticias.belongsTo(models.Categorias.id, {foreignKey: 'categoria_id', as: 'categoria'});
};
Noticias.associate = (models) => {
    Noticias.belongsTo(models.Usuarios.id, {foreignKey: 'autor_id', as: 'usuario'});
};

module.exports = {
    Noticias,
}