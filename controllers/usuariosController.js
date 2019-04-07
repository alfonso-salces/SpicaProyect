const Usuario = require('../models/usuario').Usuarios;

const usersController = {};

usersController.createUser = async(req, res, next) => {
    Usuario.create({
        nick: req.body.nick,
        email: req.body.email,
        password: req.body.password,
        nombre: req.body.nombre,
        imagen: req.body.file,
    })
    .then(
        res.json(
            "Usuario creado correctamente."
        ))
    .catch(err => res.status(400).json(err.msg));
};


usersController.login = async(req, res, next) => {
    Usuario.findOne({ where: { email: req.body.email } }).then(function (user) {
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

module.exports = usersController;