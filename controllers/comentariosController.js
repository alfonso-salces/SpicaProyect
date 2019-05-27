const Noticia = require("../models/noticia").Noticias;
const Usuario = require("../models/usuario").Usuarios;
const sequelize = require("sequelize");
const jwt = require("jsonwebtoken");
const Comentario = require("../models/comentario").Comentarios;
const commentController = {};

commentController.createComment = async (req, res, next) => {
  await Noticia.findOne({ where: { id: req.body.noticia_id } })
    .then(async function (noticia) {
      if (noticia) {
        await Comentario.create({
          cuerpo: req.body.cuerpo,
          noticia_id: req.body.noticia_id,
          autor_id: req.body.autor_id
        })
          .then(res.json("Comentario publicado correctamente."))
          .catch(err =>
            res.status(400).json({ error: "Ha ocurrido un error." })
          );
      } else {
        res.status(400).json({ error: "No existe la noticia especificada." });
      }
    })
    .catch(err => res.status(400).json({ error: "Ha ocurrido un error." }));
};

commentController.getComment = async (req, res, next) => {
  await Comentario.findOne({ where: { id: req.params.id }, include: [{ model: Noticia }, { model: Usuario, attributes: ['id', 'nombre', 'image'] }] }).then(comentario => {
    if (comentario) {
      res.json(comentario);
    } else {
      res.status(404).json({ 'error': 'No existe ese comentario' });
    }
  }).catch(err => res.status(400).json({ error: "Ha ocurrido un error." }));
};

commentController.allComments = async (req, res, next) => {
  await Comentario.findAll({ include: [{ model: Noticia }, { model: Usuario, attributes: ['id', 'nombre', 'image'] }] }).then(comentario => {
    if (comentario) {
      res.json(comentario);
    } else {
      res.status(404).json({ 'error': 'No hay comentarios actualmente' });
    }
  }).catch(err => res.status(400).json({ error: "Ha ocurrido un error." }));

};

commentController.getCommentsNew = async (req, res, next) => {
  await Comentario.findAll({ where: { noticia_id: req.params.id } })
    .then(function (comentarios) {
      if (comentarios.length != 0) {
        res.json(comentarios);
      } else {
        res.status(404).json({
          error: "La noticia especificada no tiene comentarios por el momento."
        });
      }
    })
    .catch(err => res.status(400).json({ error: "Ha ocurrido un error." }));
};

commentController.getCommentsDate = async (req, res, next) => {
  var hasta = new Date(req.body.hasta);
  var desde = new Date(req.body.desde);
  var consulta = {
    where: {
      createdAt: {
        [sequelize.Op.gt]: desde,
        [sequelize.Op.lt]: hasta
      }
    }
  };
  await Comentario.findAll(consulta)
    .then(function (comentarios) {
      if (comentarios.length != 0) {
        res.json(comentarios);
      } else {
        res
          .status(404)
          .json({ error: "No hay comentarios en la fecha especificada." });
      }
    })
    .catch(err => res.status(400).json({ error: "Ha ocurrido un error." }));
};

commentController.editComment = async (req, res, next) => {
  if (!req.headers.authorization) {
    return res
      .status(403)
      .send({ message: "Tu petición no tiene cabecera de autorización" });
  }

  var creadorComentario = await Comentario.findOne({
    where: { id: req.params.id }
  });

  var auth = req.headers.authorization.split(" ")[1];
  var payload = jwt.decode(auth, process.env.JWT_SECRET);
  if (payload) {
    await Usuario.findOne({ where: { id: payload.id } })
      .then(async function (comprobante) {
        if (comprobante) {
          if (
            comprobante.rol != "admin" &&
            comprobante.rol != "moderador" &&
            comprobante.id != creadorComentario.autor_id
          ) {
            res.status(403).json({ error: "Acceso denegado." });
          } else {
            await Comentario.findOne({ where: { id: req.params.id } })
              .then(async function (comment) {
                if (comment) {
                  await comment
                    .update({
                      cuerpo: req.body.cuerpo
                    })
                    .then(res.json("Comentario editado correctamente"))
                    .catch(err =>
                      res.status(400).json({ error: "Ha ocurrido un error." })
                    );
                } else {
                  res.status(400).json({
                    error: "No existe ningún comentario con el id especificado."
                  });
                }
              })
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

commentController.deleteComment = async (req, res, next) => {
  if (!req.headers.authorization) {
    return res
      .status(403)
      .send({ message: "Tu petición no tiene cabecera de autorización" });
  }

  var creadorComentario = await Comentario.findOne({
    where: { id: req.params.id }
  });

  var auth = req.headers.authorization.split(" ")[1];
  var payload = jwt.decode(auth, process.env.JWT_SECRET);
  if (payload) {
    await Usuario.findOne({ where: { id: payload.id } })
      .then(async function (comprobante) {
        if (comprobante) {
          if (
            comprobante.rol != "admin" &&
            comprobante.rol != "moderador" &&
            comprobante.id != creadorComentario.autor_id
          ) {
            res.status(403).json({ error: "Acceso denegado." });
          } else {
            await Comentario.findOne({ where: { id: req.params.id } })
              .then(async function (comment) {
                if (comment) {
                  await comment
                    .destroy()
                    .then(res.json("Comentario eliminado correctamente"))
                    .catch(err =>
                      res.status(400).json({ error: "Ha ocurrido un error." })
                    );
                } else {
                  res.status(400).json({
                    error: "No existe ningún comentario con el id especificado."
                  });
                }
              })
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

module.exports = commentController;
