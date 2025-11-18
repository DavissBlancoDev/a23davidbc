// =======================
// Importar dependencias
// =======================
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

// =======================
// Importar modelos
// =======================
const User = require('./models/user');
const Menu = require('./models/menu');

// =======================
// Crear servidor Express
// =======================
const app = express();
const PORT = 3000;

// =======================
// Middlewares
// =======================
app.use(express.json()); // parsea JSON
app.use(express.urlencoded({ extended: true })); // parsea formularios
app.use(express.static(path.join(__dirname, 'src'))); // servir archivos estáticos

// =======================
// Conexión a MongoDB
// =======================
mongoose.connect('mongodb://127.0.0.1:27017/nutriwise', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Conectado a MongoDB'))
.catch(err => console.error('Error al conectar MongoDB:', err));

// =======================
// Rutas API
// =======================

// --- Usuarios ---
app.post('/usuarios', async (req, res) => {
  try {
    const usuario = new User(req.body);
    await usuario.save();
    res.status(201).json(usuario);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/usuarios', async (req, res) => {
  try {
    const usuarios = await User.find();
    res.json(usuarios);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Menús ---
app.post('/menus', async (req, res) => {
  try {
    const menu = new Menu(req.body);
    await menu.save();
    res.status(201).json(menu);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/menus', async (req, res) => {
  try {
    const menus = await Menu.find();
    res.json(menus);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =======================
// Iniciar servidor
// =======================
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
