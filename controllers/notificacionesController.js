const Usuario = require("../models/usuario").Usuarios;
const jwt = require("jsonwebtoken");
const Notificacion = require("../models/notificacion").Notificaciones;
const notificationController = {};

notificationController.createNotification = async (req, res, next) => {
  if (!req.headers.authorization) {
    return res
      .status(403)
      .send({ message: "Tu petición no tiene cabecera de autorización" });
  }
  var auth = req.headers.authorization.split(" ")[1];
  var payload = jwt.decode(auth, process.env.JWT_SECRET);

  if (payload) {
    await Usuario.findOne({ where: { id: payload.id } })
      .then(async function(comprobante) {
        if (comprobante) {
          if (
            comprobante.rol != "admin" &&
            comprobante.rol != "moderador" &&
            comprobante.id != "redactor"
          ) {
            res.status(403).json({ error: "Acceso denegado." });
          } else {
            await Notificacion.create({
              titulo: req.body.titulo,
              cuerpo: req.body.cuerpo,
              autor_id: req.body.autor_id
            })
              .then(res.json("Notificación creada correctamente"))
              .catch(err =>
                res.status(400).json({ error: "Ha ocurrido un error." })
              );
          }
        }
      })
      .catch(err => res.status(400).json({ error: "Ha ocurrido un error." }));
  } else {
    res.status(400).json({ error: "Ha ocurrido un error." });
  }
};

notificationController.getNotifications = async (req, res, next) => {
  await Notificacion.findAll()
    .then(function(notificaciones) {
      if (notificaciones.length != 0) {
        res.json(notificaciones);
      } else {
        res.status(400).json({ error: "No hay notificaciones actualmente." });
      }
    })
    .catch(err =>
      res.status(400).json({ error: "No hay notificaciones actualmente." })
    );
};

notificationController.getNotification = async (req, res, next) => {
  await Notificacion.findOne({ where: { id: req.params.id } })
    .then(function(notificacion) {
      if (notificacion) {
        res.json(notificacion);
      } else {
        res.status(400).json({ error: "No hay notificaciones actualmente." });
      }
    })
    .catch(err =>
      res.status(400).json({ error: "No hay notificaciones actualmente." })
    );
};

notificationController.deleteNotification = async (req, res, next) => {
  if (!req.headers.authorization) {
    return res
      .status(403)
      .send({ message: "Tu petición no tiene cabecera de autorización" });
  }
  var auth = req.headers.authorization.split(" ")[1];
  var payload = jwt.decode(auth, process.env.JWT_SECRET);

  if (payload) {
    await Usuario.findOne({ where: { id: payload.id } })
      .then(async function(comprobante) {
        if (comprobante) {
          if (
            comprobante.rol != "admin" &&
            comprobante.rol != "moderador" &&
            comprobante.id != "redactor"
          ) {
            res.status(403).json({ error: "Acceso denegado." });
          } else {
            await Notificacion.findOne({ where: { id: req.params.id } }).then(
              async function(notificacion) {
                notificacion
                  .destroy()
                  .then(res.json("Notificación eliminada correctamente"))
                  .catch(err =>
                    res.status(400).json({
                      error: "La notificación especificada no existe."
                    })
                  );
              }
            );
          }
        }
      })
      .catch(err =>
        res
          .status(400)
          .json({ error: "La notificación especificada no existe." })
      );
  } else {
    res.status(400).json({ error: "Ha ocurrido un error." });
  }
};

module.exports = notificationController;
