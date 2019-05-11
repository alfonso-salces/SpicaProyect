const express = require('express');
const router = express.Router();

const usersController = require('../controllers/usuariosController');
const categoryController = require('../controllers/categoriasController');

// RUTAS USUARIOS.
router.post('/api/register', usersController.createUser);
router.post('/api/login', usersController.login);
router.get('/api/users', usersController.allUsers);
router.get('/api/profile', usersController.getUser);
router.delete('/api/users/:id', usersController.delete);

// RUTAS CATEGORIAS.
router.post('/api/createcategory', categoryController.createCategory);
router.put('/api/category/:id', categoryController.editCategory);
router.get('/api/category', categoryController.allCategorys);
router.get('/api/category/:id', categoryController.getCategory);
router.delete('/api/category/:id', categoryController.deleteCategory);

module.exports = router;