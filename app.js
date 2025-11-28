// =======================
// Importar dependencias
// =======================
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

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
app.use(express.static(path.join(__dirname, 'public'))); // servir archivos estáticos

// =======================
// Conexión a MongoDB
// =======================
mongoose.connect('mongodb://127.0.0.1:27017/nutriwise')
  .then(() => console.log('✅ Conectado a MongoDB'))
  .catch(err => console.error('❌ Error al conectar MongoDB:', err));

// =======================
// Rutas modularizadas
// =======================
const userRoutes = require('./routes/userRoutes');
app.use('/usuarios', userRoutes);

const menuRoutes = require('./routes/menuRoutes');
app.use('/api/menus', menuRoutes); // <-- aquí montamos las rutas de menús

// =======================
// Ruta raíz (index.html)
// =======================
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// =======================
// Servir otras páginas directamente (opcional)
// =======================
app.get('/home.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'home.html'));
});
app.get('/perfil.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'perfil.html'));
});
app.get('/planning.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'planning.html'));
});
app.get('/crear_menu.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'crear_menu.html'));
});
app.get('/recetas.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'recetas.html'));
});
app.get('/lista_compra.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'lista_compra.html'));
});

// =======================
// Iniciar servidor
// =======================
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
