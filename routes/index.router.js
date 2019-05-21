const express = require("express");
const router = express.Router();

const usersController = require("../controllers/usuariosController");
const categoryController = require("../controllers/categoriasController");
const newsController = require("../controllers/noticiasController");
const commentController = require("../controllers/comentariosController");
const notificationController = require("../controllers/notificacionesController");

// RUTAS USUARIOS.
router.post("/api/register", usersController.createUser);
router.post("/api/login", usersController.login);
router.get("/api/users", usersController.allUsers);
router.get("/api/profile", usersController.getProfile);
router.delete("/api/users/:id", usersController.delete);
router.put("/api/users/:id", usersController.editUser);

// RUTAS CATEGORIAS.
router.post("/api/createCategory", categoryController.createCategory);
router.put("/api/category/:id", categoryController.editCategory);
router.get("/api/category", categoryController.allCategorys);
router.get("/api/categoryname", categoryController.getCategoryName);
router.get("/api/category/:id", categoryController.getCategory);
router.delete("/api/category/:id", categoryController.deleteCategory);

// RUTAS NOTICIAS.
router.post("/api/createnew", newsController.createNew);
router.get("/api/newid", newsController.getNew);
router.get("/api/newauthorname", newsController.getNewsPerAuthorName);
router.get("/api/newaategoryname", newsController.getNewsPerCategoryName);
router.get("/api/news", newsController.getNews);
router.put("/api/editnew/:id", newsController.editNew);
router.delete("/api/deletenew/:id", newsController.deleteNew);

// RUTAS COMENTARIOS
router.post("/api/createcomment", commentController.createComment);
router.get("/api/comment/:id", commentController.getComment);
router.get("/api/comments", commentController.allComments);
router.get("/api/commentsautor/:id", commentController.getCommentsAutor);
router.get("/api/commentsnew/:id", commentController.getCommentsNew);
router.get("/api/commentsdate", commentController.getCommentsDate);
router.put("/api/editcomment/:id", commentController.editComment);
router.delete("/api/deletecomment/:id", commentController.deleteComment);

// RUTAS NOTIFICACIONES
router.get("/api/notifications", notificationController.getNotifications);
router.get("/api/notification/:id", notificationController.getNotification);
router.post(
  "/api/createnotification",
  notificationController.createNotification
);
router.delete(
  "/api/notification/:id",
  notificationController.deleteNotification
);

module.exports = router;
