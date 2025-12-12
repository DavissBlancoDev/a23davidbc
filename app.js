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
const PORT = process.env.PORT || 3000; // Railway asignará PORT automáticamente

// =======================
// Middlewares
// =======================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// =======================
// Conexión a MongoDB
// =======================
// Usa MONGO_URI de entorno (Atlas) o localhost en desarrollo
const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/nutriwise';

mongoose.connect(mongoURI)
  .then(() => console.log(`✅ Conectado a MongoDB: ${mongoURI}`))
  .catch(err => {
    console.error('❌ Error al conectar MongoDB:', err);
    process.exit(1); // Detener app si no hay conexión
  });

// =======================
// Rutas modularizadas
// =======================
const userRoutes = require('./routes/userRoutes');
const menuRoutes = require('./routes/menuRoutes');

app.use('/usuarios', userRoutes);
app.use('/api/menus', menuRoutes);

// =======================
// Rutas de páginas
// =======================
const pages = ['index', 'home', 'perfil', 'planning', 'crear_menu', 'recetas', 'lista_compra'];
pages.forEach(page => {
  app.get(`/${page}.html`, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', `${page}.html`));
  });
});

// =======================
// Ruta raíz
// =======================
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// =======================
// Iniciar servidor
// =======================
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
