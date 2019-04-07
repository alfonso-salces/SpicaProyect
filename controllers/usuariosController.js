const Usuario = require('../models/usuario').Usuarios;
const usersController = {};
const fs = require('fs');

/**
 * @params
 * 
 */



usersController.createUser = async(req, res, next) => {

    const ext = req.file.filename.split(".")[1];

    if(ext == 'jpg' || ext == 'png' || ext == 'jpeg') {
        await Usuario.create({
            nick: req.body.nick,
            email: req.body.email,
            password: req.body.password,
            nombre: req.body.nombre,
            image: req.file.filename,
        })
        .then(
            console.log(req.file.filename),
            res.json(
                "Usuario creado correctamente."
            ))
        .catch(err => res.status(400).json(err.msg));
    } else {
        res.status(422).json({'Error': 'Solo se admiten imágenes con formato jpg o png.'});
    }

};


usersController.login = async(req, res, next) => {
    await Usuario.findOne({ where: { email: req.body.email } }).then(function (user) {
        if (!user) {
            console.log('El correo electrónico y/o la contraseña introducidos no son correctos.');
            res.status(422).json({'error': 'El correo electrónico y/o la contraseña introducidos no son correctos.'});
        } else if (!user.validPassword(req.body.password)) {
            console.log('La contraseña introducida no es correcta.');
            res.status(422).json({'error': 'El correo electrónico y/o la contraseña introducidos no son correctos.'});
        } else {
            console.log('Has iniciado sesióin correctamente.');
            res.status(200).json({'success': 'Has iniciado sesióin correctamente.'});
        }
    });
}

usersController.delete = async(req, res, next) => {
    
    var imagenUsuario;
    await Usuario.findOne({ where: { id: req.params.id } }).then(function (user) {
        imagenUsuario = user.image;
    });

    console.log(imagenUsuario);
    await Usuario.destroy({ where: {id: req.params.id}}).then(async function(rowDeleted) {
        if(rowDeleted === 1){
            try {
                fs.unlinkSync("D:/Mio/PROYECTOS/SpicaProyect/public/img/uploads/" + imagenUsuario);
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
}

usersController.allUsers = async(req, res, next) => {
    var usuarios = await Usuario.findAll();
    if(usuarios.length > 0) {
        res.json(usuarios);
    } else {
        res.status(400).json({'error': 'Ha ocurrido un error.'});
    }
}

usersController.getUser = async(req, res, next) => {
    var usuario = await Usuario.findOne({ where: { id: req.params.id }});
    if(usuario) {
        res.json(usuario);
    } else {
        res.status(400).json({'error': 'Ha ocurrido un error.'});
    }
}

module.exports = usersController;