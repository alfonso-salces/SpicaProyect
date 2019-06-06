const sequelize = require("sequelize");
const db = require("../models/db");
const Model = sequelize.Model;
const Notificacion = require("./notificacion").Notificaciones;
const Usuario = require("./usuario").Usuarios;

class Categorias extends Model {}
Categorias.init(
  {
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
          msg: "Debes de introducir un nombre de categoría."
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
    }
  },
  {
    sequelize: db,
    freezeTableName: true
  }
);

Categorias.belongsTo(Usuario, { foreignKey: "autor_id" });
Usuario.hasMany(Categorias, { as: "categorias", foreignKey: "autor_id" });

Categorias.beforeCreate((categoria, options) => {
  Notificacion.create({
    titulo: "Nueva Categoría",
    cuerpo: categoria.nombre,
    autor_id: categoria.autor_id
  });
});

module.exports = {
  Categorias
};
