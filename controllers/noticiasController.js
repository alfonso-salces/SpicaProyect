const Noticia = require('../models/noticia').Noticias;
const newsController = {};
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

newsController.createNew = async(req, res, next) => {
    await Noticia.create({
        titular: req.body.titular,
        contenido: req.body.contenido,
        image: req.body.image,
        categoria_id: req.body.categoria_id,
        autor_id: req.body.autor_id,
    }).then(
        res.json('Noticia creada correctamente'),
    ).catch(err => res.status(400).json(err.msg));
}

module.exports = newsController;