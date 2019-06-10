const sequelize = require("sequelize");
const db = require("../models/db");
const Model = sequelize.Model;
const Noticia = require("./noticia").Noticias;
const Usuario = require("./usuario").Usuarios;

class Comentarios extends Model {}
Comentarios.init(
  {
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
          msg: "Debes de introducir un cuerpo en tu comentario."
        },
        notNull: {
          msg: "El valor introducido no puede ser nulo."
        }
      }
    }
  },
  {
    sequelize: db,
    freezeTableName: true
  }
);

Comentarios.belongsTo(Usuario, { foreignKey: "autor_id" });
Comentarios.belongsTo(Noticia, { foreignKey: "noticia_id" });
Noticia.hasMany(Comentarios, { foreignKey: "noticia_id" });
Usuario.hasMany(Comentarios, { foreignKey: "autor_id" });

module.exports = {
  Comentarios
};
