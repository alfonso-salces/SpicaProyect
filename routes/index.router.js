const express = require('express');
const router = express.Router();

const usersController = require('../controllers/usuariosController');

// RUTAS API REST.
router.post('/api/register', usersController.createUser);
router.post('/api/login', usersController.login);
router.get('/api/users', usersController.allUsers);
router.get('/api/profile', usersController.getUser);
router.delete('/api/users/:id', usersController.delete);

module.exports = router;