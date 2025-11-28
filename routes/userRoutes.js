const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  obtenerUsuario,
  editarPerfil,
  cambiarContrasena
} = require("../controllers/userController");

// Registro / Login
router.post("/register", registerUser);
router.post("/login", loginUser);

// Perfil
router.get("/:userId", obtenerUsuario);
router.put("/editar", editarPerfil);

// Contraseña
router.put("/contrasena", cambiarContrasena);

module.exports = router;
