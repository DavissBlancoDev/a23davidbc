const express = require('express');
const router = express.Router();
const {
  crearMenu,
  obtenerMenusUsuario,
  obtenerMenu,
  editarMenu,
  borrarMenu
} = require('../controllers/menuController');

// Crear menú
router.post('/', crearMenu);

// Obtener todos los menús de un usuario
router.get('/usuario/:usuarioId', obtenerMenusUsuario);

// Obtener un menú concreto
router.get('/:id', obtenerMenu);

// Editar un menú
router.put('/:id', editarMenu);

// Borrar un menú
router.delete('/:id', borrarMenu);

module.exports = router;
