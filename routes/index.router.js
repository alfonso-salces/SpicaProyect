const express = require('express');
const router = express.Router();

const usersController = require('../controllers/usuariosController');
  
// router.get('/users/:id', (req, res) => {
//     Usuario.findById(req.params.id, {
//     attributes: ['id', 'nick']
//   })
//   .then(result => res.json(result))
//   .catch(error => {
//     res.status(412).json({msg: error.message});
//   });
// });

// router.delete('/users/:id', (req, res) => {
//     Usuario.destroy({where: {id: req.params.id}})
//     .then(result => res.sendStatus(204))
//     .catch(error => {
//       res.status(412).json({msg: error.message});
//     });
// });

router.post('/register', usersController.createUser);
router.post('/login', usersController.login);

module.exports = router;