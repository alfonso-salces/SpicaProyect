const express = require('express');
const router = express.Router();

const usersController = require('../controllers/usuariosController');
const categoriesController = require('../controllers/categoriasController');
const newsController = require('../controllers/noticiasController');

// RUTAS USUARIOS.
router.post('/api/register', usersController.createUser);
router.post('/api/login', usersController.login);
router.get('/api/users', usersController.allUsers);
router.get('/api/profile', usersController.getUser);
router.delete('/api/users/:id', usersController.delete);
router.put('/api/users/:id', usersController.editUser);

// RUTAS CATEGORIAS.
router.post('/api/createcategory', categoriesController.createCategory);
router.put('/api/category/:id', categoriesController.editCategory);
router.get('/api/category', categoriesController.allCategorys);
router.get('/api/category/:id', categoriesController.getCategory);
router.delete('/api/category/:id', categoriesController.deleteCategory);

// RUTAS NOTICIAS.
router.post('/api/createnew', newsController.createNew);
router.get('/api/newId', newsController.getNew);
router.get('/api/newAuthorName', newsController.getNewsPerAuthorName);
router.get('/api/newCategoryName', newsController.getNewsPerCategoryName);
router.get('/api/news', newsController.getNews);
router.delete('/api/deletenew/:id', newsController.deleteNew);

module.exports = router;