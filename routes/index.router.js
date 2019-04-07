const express = require('express');
const router = express.Router();

const usersController = require('../controllers/usuariosController');
  
router.post('/register', usersController.createUser);
router.post('/login', usersController.login);
router.post('/users');
router.post('/users/:id');
router.delete('/users/:id');

module.exports = router;