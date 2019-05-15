const express = require('express');
const router = express.Router();

const usersController = require('../controllers/usuariosController');
const categoryController = require('../controllers/categoriasController');
const newsController = require('../controllers/noticiasController');

// RUTAS USUARIOS.
router.post('/api/register', usersController.createUser);
router.post('/api/login', usersController.login);
router.get('/api/users', usersController.allUsers);
router.get('/api/profile', usersController.getUser);
router.delete('/api/users/:id', usersController.delete);
router.put('/api/users/:id', usersController.editUser);

// RUTAS CATEGORIAS.
router.post('/api/createCategory', categoryController.createCategory);
router.put('/api/category/:id', categoryController.editCategory);
router.get('/api/category', categoryController.allCategorys);
router.get('/api/category/:id', categoryController.getCategory);
router.delete('/api/category/:id', categoryController.deleteCategory);

// RUTAS NOTICIAS.
router.post('/api/createnew', newsController.createNew);
router.get('/api/newid', newsController.getNew);
router.get('/api/newauthorname', newsController.getNewsPerAuthorName);
router.get('/api/newaategoryname', newsController.getNewsPerCategoryName);
router.get('/api/news', newsController.getNews);
router.delete('/api/deletenew/:id', newsController.deleteNew);

module.exports = router;