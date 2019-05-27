const sequelize = require("sequelize");
const db = require("../models/db");
const Model = sequelize.Model;
const Categoria = require("./categoria").Categorias;
const Usuario = require("./usuario").Usuarios;
const Notificacion = require("./notificacion").Notificaciones;

class Noticias extends Model { }
Noticias.init(
  {
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
          msg: "Debes de introducir un titular de noticia."
        },
        notNull: {
          msg: "El valor introducido no puede ser nulo."
        }
      }
    },
    contenido: {
      type: sequelize.STRING(65000),
      allowNull: false,
      notEmpty: true,
      validate: {
        notEmpty: {
          msg: "Debes de introducir contenido para tu noticia."
        },
        notNull: {
          msg: "El valor introducido no puede ser nulo."
        }
      }
    },
    image: {
      type: sequelize.STRING,
      allowNull: false,
      notEmpty: true
      //defaultValue: 'default'
    },
  },
  {
    sequelize: db,
    freezeTableName: true
  }
);

Noticias.beforeCreate((noticia, options) => {
  Notificacion.create({
    titulo: "Nueva Noticia",
    cuerpo: noticia.titular,
    autor_id: noticia.autor_id
  });
});

Noticias.belongsTo(Usuario, { foreignKey: 'autor_id' });
Noticias.belongsTo(Categoria, { foreignKey: 'categoria_id' });
Usuario.hasMany(Noticias, { as: 'noticias', foreignKey: 'autor_id' });
Categoria.hasMany(Noticias, { foreignKey: 'categoria_id' });

module.exports = {
  Noticias
};
