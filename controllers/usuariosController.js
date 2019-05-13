const Usuario = require('../models/usuario').Usuarios;
const usersController = {};
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

/**
 *  Crea un usuario.
 * 
 *  BODY:
 *  @param nick: String
 *  @param email: String
 *  @param password: String
 *  @param nombre: String
 *  @param image: File (Extensiones admitidas: JPG, JPEG, PNG)
 * 
 *  HEADERS:
 *  Content-Type: x-www-form-urlencoded
 *  Authorization Bearer <Token>
 * 
 */

usersController.createUser = async(req, res, next) => {

    if(!req.headers.authorization) {
        return res
            .status(403)
            .send({message: "Tu petición no tiene cabecera de autorización"});
    }

    var auth = req.headers.authorization.split(" ")[1];
    var payload = jwt.decode(auth, process.env.JWT_SECRET);
    if(payload) {
        await Usuario.findOne({where: {id: payload.id}}).then( async function(comprobante) {
            if(comprobante){
                if(comprobante.rol != 'admin' && comprobante.rol != 'moderador' || req.body.id != payload.id) {
                    fs.unlinkSync(path.join("./", process.env.urlImagen + "/" + req.file.filename));
                    res.status(403).json({'error': 'Acceso denegado.'});
                } else {
                    await Usuario.findOne({ where: { email: req.body.email } }).then(async function (user) {

                        if(user){
                            res.status(422).json('Ha ocurrido un error.');
                        } else{
                            const ext = req.file.filename.split(".")[1];
                    
                            if(ext == 'jpg' || ext == 'png' || ext == 'jpeg') {
                                await Usuario.create({
                                    nick: req.body.nick,
                                    email: req.body.email,
                                    password: req.body.password,
                                    nombre: req.body.nombre,
                                    image: req.file.filename,
                                    rol: req.body.rol,
                                })
                                .then(
                                    console.log(req.file.filename),
                                    res.json(
                                        "Usuario creado correctamente."
                                    ),
                                    await Usuario.findOne({ where: { email: req.body.email} }).then(function (user) {
                                        if(!fs.existsSync(path.join("./", process.env.urlImagen + "/usuarios"))) fs.mkdirSync(path.join("./", process.env.urlImagen + "/usuarios"));
                                        if(!fs.existsSync(path.join("./", process.env.urlImagen + "/usuarios/") + user.id)) fs.mkdirSync(path.join("./", process.env.urlImagen + "/usuarios/") + user.id);
                                        fs.renameSync(path.join("./", process.env.urlImagen + "/" + req.file.filename), path.join("./", process.env.urlImagen + "/usuarios/" + user.id + "/" + req.file.filename));
                                    }),
                                    )
                                .catch(err => res.status(400).json(err.msg));
                            } else {
                                fs.unlinkSync(path.join("./", process.env.urlImagen + "/" + req.file.filename));
                                res.status(422).json({'error': 'Solo se admiten imágenes con formato jpg o png.'});
                            }
                        }
                    })
                }
            }
        }).catch(err => res.status(400).json(err.msg));
    } else {
        fs.unlinkSync(path.join("./", process.env.urlImagen + "/" + req.file.filename));
        res.status(403).json({'error': 'Acceso denegado.'});
    }

};

/**
 *  Edita un usuario.
 *  @param id: Integer
 * 
 *  BODY:
 *  @param nick: String
 *  @param email: String
 *  @param password: String
 *  @param nombre: String
 *  @param image: File (Extensiones admitidas: JPG, JPEG, PNG)
 * 
 *  HEADERS:
 *  Content-Type: x-www-form-urlencoded
 *  Authorization Bearer <Token>
 * 
 */

usersController.editUser = async(req, res, next) => {

    if(!req.headers.authorization) {
        return res
            .status(403)
            .send({message: "Tu petición no tiene cabecera de autorización"});
    }

    var auth = req.headers.authorization.split(" ")[1];
    var payload = jwt.decode(auth, process.env.JWT_SECRET);
    if(payload) {
        await Usuario.findOne({where: {id: payload.id}}).then( async function(comprobante) {
            if(comprobante){
                if(comprobante.rol != 'admin' && comprobante.rol != 'moderador') {
                    fs.unlinkSync(path.join("./", process.env.urlImagen + "/" + req.file.filename));
                    res.status(403).json({'error': 'Acceso denegado.'});
                } else {
                    await Usuario.findOne({ where: { id: req.params.id } }).then(async function (user) {

                        if(user){
                            const ext = req.file.filename.split(".")[1];
                    
                            if(ext == 'jpg' || ext == 'png' || ext == 'jpeg') {
                                let old_pic = user.image; 
                                await user.update({
                                    nick: req.body.nick,
                                    email: req.body.email,
                                    password: req.body.password,
                                    nombre: req.body.nombre,
                                    image: req.file.filename,
                                    rol: req.body.rol,
                                })
                                .then(async function() {
                                    fs.unlinkSync(path.join("./", process.env.urlImagen + "/usuarios/" + req.params.id + "/" + old_pic));
                                    fs.renameSync(path.join("./", process.env.urlImagen + "/" + req.file.filename), path.join("./", process.env.urlImagen + "/usuarios/" + req.params.id + "/" + req.file.filename));
                                    res.json(
                                        "Usuario actualizado correctamente."
                                    );
                                }).catch(err => res.status(400).json(err));
                            } else {
                                fs.unlinkSync(path.join("./", process.env.urlImagen + "/" + req.file.filename));
                                res.status(422).json({'error': 'Solo se admiten imágenes con formato jpg o png.'});
                            }
                            
                        } else{
                            fs.unlinkSync(path.join("./", process.env.urlImagen + "/" + req.file.filename));
                            res.status(422).json('Ha ocurrido un error.');
                        }
                    })
                }
            }
        }).catch(err => res.status(400).json(err.msg));
    } else {
        fs.unlinkSync(path.join("./", process.env.urlImagen + "/" + req.file.filename));
        res.status(403).json({'error': 'Acceso denegado.'});
    }

};


usersController.login = async(req, res, next) => {
    await Usuario.findOne({ where: { email: req.body.email } }).then(function (user) {
        if (!user) {
            console.log('El correo electrónico y/o la contraseña introducidos no son correctos.');
            console.log(req.body.password);
            console.log(req.body.email);
            res.status(422).json('El correo electrónico y/o la contraseña introducidos no son correctos.');
        } else if (!user.validPassword(req.body.password)) {
            console.log('La contraseña introducida no es correcta.');
            console.log(req.body.password);
            console.log(req.body.email);
            res.status(422).json('El correo electrónico y/o la contraseña introducidos no son correctos.');
        } else {
            var tokenData = {
                id: user.id,
                nombre: user.nombre,
                nick: user.nick,
                email: user.email,
                image: user.image,
                rol: user.rol
            }
            var token = jwt.sign(tokenData, process.env.JWT_SECRET, {
                expiresIn: 60 * 60 * 24 // El token expira en 24 horas.
            })
            console.log('Has iniciado sesión correctamente.');
            res.status(200).json({token});
        }
    });
}

usersController.delete = async(req, res, next) => {

    if(!req.headers.authorization) {
        return res
            .status(403)
            .send({message: "Tu petición no tiene cabecera de autorización"});
    }

    var auth = req.headers.authorization.split(" ")[1];
    var payload = jwt.decode(auth, process.env.JWT_SECRET);
    if(payload) {
        await Usuario.findOne({where: {id: payload.id}}).then( async function(comprobante) {
            if(comprobante){
                if(comprobante.rol != 'admin' && comprobante.rol != 'moderador') {
                    res.status(403).json({'error': 'Acceso denegado.'});
                } else {
                    await Usuario.findOne({ where: { email: req.body.email } }).then(async function (user) {

                        if(user){
                            res.status(422).json('Ha ocurrido un error.');
                        } else{
                            
                        var imagenUsuario;
                        await Usuario.findOne({ where: { id: req.params.id } }).then(async function (user) {
                            if(user) {
                                imagenUsuario = user.image;
                            } else {
                                console.log('No existe el usuario especificado.');
                                res.status(422).json({'success': 'No existe el usuario especificado.'});
                            }
                        });

                        console.log(imagenUsuario);
                        await Usuario.destroy({ where: {id: req.params.id}}).then(async function(rowDeleted) {
                            if(rowDeleted === 1){
                                try {
                                    fs.unlinkSync(path.join("./", process.env.urlImagen + "/usuarios/" + req.params.id + "/" + imagenUsuario));
                                    fs.rmdirSync(path.join("./", process.env.urlImagen + "/usuarios/" + req.params.id))
                                    console.log('Imagen borrada correctamente.');
                                } catch (err) {
                                    console.log(err);
                                }
                            console.log('Usuario eliminado correctamente.');
                            res.status(200).json({'success': 'Usuario eliminado correctamente.'});
                            } else {
                            console.log('No existe el usuario especificado.');
                            res.status(422).json({'success': 'No existe el usuario especificado.'});
                            }
                        }, function(err){
                            console.log(err);
                            res.status(400).json({'error': 'Ha ocurrido un error.'});
                        });
                    }})
                }
            }
        }).catch(err => res.status(400).json(err.msg));
    } else {
        res.status(403).json({'error': 'Acceso denegado.'});
    }

}

usersController.allUsers = async(req, res, next) => {

    if(!req.headers.authorization) {
        return res
            .status(403)
            .send({message: "Tu petición no tiene cabecera de autorización"});
    }

    var auth = req.headers.authorization.split(" ")[1];
    var payload = jwt.decode(auth, process.env.JWT_SECRET);
    if(payload) {
        await Usuario.findOne({where: {id: payload.id}}).then( async function(comprobante) {
            if(comprobante){
                if(comprobante.rol != 'admin' && comprobante.rol != 'moderador') {
                    res.status(403).json({'error': 'Acceso denegado.'});
                } else {
                    var usuarios = await Usuario.findAll({attributes: ['id', 'email', 'nick', 'nombre', 'image', 'rol', 'createdAt']});
                    if(usuarios.length > 0) {
                        res.json(usuarios);
                    } else {
                        res.status(400).json({'error': 'Ha ocurrido un error.'});
                    }
                }
            }
        }).catch(err => res.status(400).json(err.msg));
    } else {
        res.status(403).json({'error': 'Acceso denegado.'});
    }
}

usersController.getUser = async(req, res, next) => {
    if(!req.headers.authorization) {
        return res
            .status(403)
            .send({message: "Tu petición no tiene cabecera de autorización"});
    }

    var auth = req.headers.authorization.split(" ")[1];
    var payload = jwt.decode(auth, process.env.JWT_SECRET);
    if(payload) {
        console.log(req.body.id);
        await Usuario.findOne({where: {id: payload.id}}).then( async function(comprobante) {
            if(comprobante){
                if(comprobante.rol != 'admin' || comprobante.rol != 'moderador' || req.body.id != payload.id) {
                    var usuario = await Usuario.findOne({ where: { id: req.body.id }, attributes: ['id', 'email', 'nick', 'nombre', 'image', 'rol', 'createdAt']});
                    if(usuario) {
                        res.json(usuario);
                    } else {
                        res.status(400).json({'error': 'Ha ocurrido un error.'});
                    }
                } else {
                    res.status(403).json({'error': 'Acceso denegado.'});
                }
            }
        }).catch(err => res.status(400).json(err.msg));
    } else {
        res.status(403).json({'error': 'Acceso denegado.'});
    }
}

module.exports = usersController;