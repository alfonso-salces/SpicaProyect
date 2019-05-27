const Noticia = require("../models/noticia").Noticias;
const Usuario = require("../models/usuario").Usuarios;
const Categoria = require("../models/categoria").Categorias;
const newsController = {};
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");

/**
 *
 * Crea una noticia.
 *
 * @param titular: String
 * @param contenido: String
 * @param image: File (Extensiones admitidas: JPG, JPEG, PNG)
 * @param categoria_id: Integer
 * @param autor_id: Integer
 *
 */

newsController.createNew = async (req, res, next) => {
  if (!req.headers.authorization) {
    return res
      .status(403)
      .send({ message: "Tu petición no tiene cabecera de autorización" });
  }

  var auth = req.headers.authorization.split(" ")[1];
  var payload = jwt.decode(auth, process.env.JWT_SECRET);
  if (payload) {
    await Usuario.findOne({ where: { id: payload.id } })
      .then(async function (comprobante) {
        if (comprobante) {
          if (comprobante.rol != "admin" && comprobante.rol != "redactor") {
            fs.unlinkSync(
              path.join("./", process.env.urlImagen + "/" + req.file.filename)
            );
            res.status(403).json({ error: "Acceso denegado." });
          } else {
            await Categoria.findOne({
              where: { id: req.body.categoria_id }
            }).then(async function (category) {
              if (!category) {
                fs.unlinkSync(
                  path.join(
                    "./",
                    process.env.urlImagen + "/" + req.file.filename
                  )
                );
                res.status(404).json({
                  error:
                    "No puedes asignar una noticia a una categoría inexistente."
                });
              } else {
                const ext = req.file.filename.split(".")[1];

                if (ext == "jpg" || ext == "png" || ext == "jpeg") {
                  await Noticia.create({
                    titular: req.body.titular,
                    contenido: req.body.contenido,
                    image: req.file.filename,
                    categoria_id: req.body.categoria_id,
                    autor_id: req.body.autor_id
                  })
                    .then(
                      await Noticia.findOne({
                        where: { titular: req.body.titular }
                      }).then(function (noticia) {
                        if (
                          !fs.existsSync(
                            path.join("./", process.env.urlImagen + "/noticias")
                          )
                        )
                          fs.mkdirSync(
                            path.join("./", process.env.urlImagen + "/noticias")
                          );
                        if (
                          !fs.existsSync(
                            path.join(
                              "./",
                              process.env.urlImagen + "/noticias/"
                            ) + noticia.id
                          )
                        )
                          fs.mkdirSync(
                            path.join(
                              "./",
                              process.env.urlImagen + "/noticias/"
                            ) + noticia.id
                          );
                        fs.renameSync(
                          path.join(
                            "./",
                            process.env.urlImagen + "/" + req.file.filename
                          ),
                          path.join(
                            "./",
                            process.env.urlImagen +
                            "/noticias/" +
                            noticia.id +
                            "/" +
                            req.file.filename
                          )
                        );
                        res.json("Noticia creada correctamente")
                      })
                    )
                    .catch(err => res.status(400).json(err.msg));
                } else {
                  fs.unlinkSync(
                    path.join(
                      "./",
                      process.env.urlImagen + "/" + req.file.filename
                    )
                  );
                  res.status(422).json({
                    error: "Solo se admiten imágenes con formato jpg o png."
                  });
                }
              }
            });
          }
        }
      })
      .catch(err => res.status(400).json(err.msg));
  } else {
    fs.unlinkSync(
      path.join("./", process.env.urlImagen + "/" + req.file.filename)
    );
    res.status(403).json({ error: "Acceso denegado." });
  }
};

newsController.editNew = async (req, res, next) => {
  if (!req.headers.authorization) {
    return res
      .status(403)
      .send({ message: "Tu petición no tiene cabecera de autorización" });
  }

  var auth = req.headers.authorization.split(" ")[1];
  var payload = jwt.decode(auth, process.env.JWT_SECRET);
  if (payload) {
    await Usuario.findOne({ where: { id: payload.id } })
      .then(async function (comprobante) {
        if (comprobante) {
          if (comprobante.rol != "admin" && comprobante.rol != "redactor") {
            fs.unlinkSync(
              path.join("./", process.env.urlImagen + "/" + req.file.filename)
            );
            res.status(403).json({ error: "Acceso denegado." });
          } else {
            await Categoria.findOne({
              where: { id: req.body.categoria_id }
            }).then(async function (category) {
              if (!category) {
                fs.unlinkSync(
                  path.join(
                    "./",
                    process.env.urlImagen + "/" + req.file.filename
                  )
                );
                res.status(404).json({
                  error:
                    "No puedes asignar una noticia a una categoría inexistente."
                });
              } else {
                await Noticia.findOne({ where: { id: req.params.id } })
                  .then(async function (noticia) {
                    const ext = req.file.filename.split(".")[1];

                    if (ext == "jpg" || ext == "png" || ext == "jpeg") {
                      await noticia
                        .update({
                          titular: req.body.titular,
                          contenido: req.body.contenido,
                          image: req.file.filename,
                          categoria_id: req.body.categoria_id,
                          autor_id: req.body.autor_id
                        })
                        .then(
                          await Noticia.findOne({
                            where: { titular: req.body.titular }
                          }).then(function (noticia) {
                            if (
                              !fs.existsSync(
                                path.join(
                                  "./",
                                  process.env.urlImagen + "/noticias"
                                )
                              )
                            )
                              fs.mkdirSync(
                                path.join(
                                  "./",
                                  process.env.urlImagen + "/noticias"
                                )
                              );
                            if (
                              !fs.existsSync(
                                path.join(
                                  "./",
                                  process.env.urlImagen + "/noticias/"
                                ) + noticia.id
                              )
                            )
                              fs.mkdirSync(
                                path.join(
                                  "./",
                                  process.env.urlImagen + "/noticias/"
                                ) + noticia.id
                              );
                            fs.renameSync(
                              path.join(
                                "./",
                                process.env.urlImagen + "/" + req.file.filename
                              ),
                              path.join(
                                "./",
                                process.env.urlImagen +
                                "/noticias/" +
                                noticia.id +
                                "/" +
                                req.file.filename
                              )
                            );
                            res.json("Noticia actualizada correctamente")
                          })

                        )
                        .catch(err => res.status(400).json(err.msg));
                    } else {
                      fs.unlinkSync(
                        path.join(
                          "./",
                          process.env.urlImagen + "/" + req.file.filename
                        )
                      );
                      res.status(422).json({
                        error: "Solo se admiten imágenes con formato jpg o png."
                      });
                    }
                  })
                  .catch(err =>
                    res
                      .status(400)
                      .json({ error: "No existe la noticia especificada" })
                  );
              }
            });
          }
        }
      })
      .catch(err => res.status(400).json(err.msg));
  } else {
    fs.unlinkSync(
      path.join("./", process.env.urlImagen + "/" + req.file.filename)
    );
    res.status(403).json({ error: "Acceso denegado." });
  }
};

/**
 *
 *  Elimina una noticia.
 *
 *  @param id: Integer
 *
 *  HEADERS:
 *  Content-Type: x-www-form-urlencoded
 *  Authorization Bearer <Token>
 *
 */

newsController.deleteNew = async (req, res, next) => {
  if (!req.headers.authorization) {
    return res
      .status(403)
      .send({ message: "Tu petición no tiene cabecera de autorización" });
  }

  var auth = req.headers.authorization.split(" ")[1];
  var payload = jwt.decode(auth, process.env.JWT_SECRET);

  if (payload) {
    await Usuario.findOne({ where: { id: payload.id } })
      .then(async function (comprobante) {
        if (comprobante) {
          if (comprobante.rol != "admin" && comprobante.rol != "redactor") {
            res.status(403).json({ error: "Acceso denegado." });
          } else {
            var imagenNoticia;
            await Noticia.findOne({ where: { id: req.params.id } }).then(
              async function (noticia) {
                if (noticia) {
                  imagenNoticia = noticia.image;
                } else {
                  res
                    .status(404)
                    .json({ success: "No existe la categoria especificada." });
                }
              }
            );

            await Noticia.destroy({ where: { id: req.params.id } }).then(
              async function (rowDeleted) {
                if (rowDeleted === 1) {
                  try {
                    fs.unlinkSync(
                      path.join(
                        "./",
                        process.env.urlImagen +
                        "/noticias/" +
                        req.params.id +
                        "/" +
                        imagenNoticia
                      )
                    );
                    fs.rmdirSync(
                      path.join(
                        "./",
                        process.env.urlImagen + "/noticias/" + req.params.id
                      )
                    );
                  } catch (err) {
                    console.log(err);
                  }
                  console.log("Noticia eliminada correctamente.");
                  res
                    .status(200)
                    .json({ success: "Noticia eliminada correctamente." });
                } else {
                  console.log("No existe la noticia especificada.");
                  res
                    .status(404)
                    .json({ success: "No existe la noticia especificada." });
                }
              },
              function (err) {
                console.log(err);
                res.status(400).json({ error: "Ha ocurrido un error." });
              }
            );
          }
        }
      })
      .catch(err => res.status(400).json(err.msg));
  } else {
    res.status(403).json({ error: "Acceso denegado." });
  }
};

/**
 *
 *  Retorna una noticia por ID
 *  BODY:
 *  @param id: Integer
 *
 *  HEADERS:
 *  Content-Type: x-www-form-urlencoded
 *
 */

newsController.getNew = async (req, res, next) => {

  await Noticia.findOne({ where: { id: req.body.id }, include: [{ model: Usuario, attributes: ['id', 'nombre'] }, { model: Categoria }] }).then(noticia => {
    if (noticia) {
      res.status(200).json(noticia)
    } else {
      res.status(404).json({ error: "No hay noticias." });
    }
  }).catch(err => res.status(400).json({ error: 'Bad request' }));
}

/**
 *
 *  Retorna todas las noticias
 *
 *  HEADERS:
 *  Content-Type: x-www-form-urlencoded
 *
 */

newsController.getNews = async (req, res, next) => {

  await Noticia.findAll({ include: [{ model: Usuario, attributes: ['id', 'nombre'] }, { model: Categoria }] }).then(noticia => {
    if (noticia.length != 0) {
      res.status(200).json(noticia)
    } else {
      res.status(404).json({ error: "No hay noticias." });
    }
  }).catch(err => res.status(400).json({ error: 'Bad request' }));
}

/**
 *
 *  Retorna noticias por nombre de autor
 *  BODY:
 *  @param name: String
 *
 *  HEADERS:
 *  Content-Type: x-www-form-urlencoded
 *
 */

newsController.getNewsPerAuthorName = async (req, res, next) => {
  let autorCons;
  await Usuario.findOne({ where: { nombre: req.body.name } })
    .then(async function (autor) {
      if (!autor) {
        res.status(404).json({ error: "El autor introducido no existe." });
      } else {
        autorCons = autor;
      }
      noticias = await Noticia.findAll({ where: { autor_id: autorCons.id } })
        .then(async function (noti) {
          if (noti) {
            res.json(noti);
          } else {
            res
              .status(404)
              .json({ error: "No hay noticias creadas por ese autor." });
          }
        })
        .catch(err => res.status(400).json(err.msg));
    })
    .catch(err => res.status(400).json(err));
}

/**
 *
 *  Retorna noticias por nombre de categoria
 *  BODY:
 *  @param name: String
 *
 *  HEADERS:
 *  Content-Type: x-www-form-urlencoded
 *
 */

newsController.getNewsPerCategoryName = async (req, res, next) => {
  // let CategoriaCons;
  // await Categoria.findOne({ where: { nombre: req.body.name } })
  //   .then(async function (categoria) {
  //     if (!categoria) {
  //       res.status(404).json({ error: "La categoría introducida no existe." });
  //     } else {
  //       CategoriaCons = categoria;
  //     }

  //     noticias = await Noticia.findAll({
  //       where: { categoria_id: CategoriaCons.id }
  //     })
  //       .then(async function (noti) {
  //         if (noti.length != 0) {
  //           res.json(noti);
  //         } else {
  //           res
  //             .status(404)
  //             .json({ error: "No hay noticias en esa categoría." });
  //         }
  //       })
  //       .catch(err => res.status(400).json(err.msg));
  //   })
  //   .catch(err => res.status(400).json({ error: "Bad request." }));

  await Categoria.findOne({ include: [{ model: Noticia }] }).then(
    noticia => { res.status(200).json(noticia) }
  ).catch(err => { console.log(err), res.status(400).json(err) });
}

module.exports = newsController;
