const express = require('express');
const router = express.Router();

const usersController = require('../controllers/usuariosController');
  
router.post('/register', usersController.createUser);
router.post('/login', usersController.login);
router.get('/users', usersController.allUsers);
router.get('/users/:id', usersController.getUser);
router.delete('/users/:id', usersController.delete);

module.exports = router;