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
// Usamos MONGO_URI de entorno si está definido (Railway o Docker)
// Por defecto, en local conecta a localhost
const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/nutriwise';

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
  .then(() => console.log(`✅ Conectado a MongoDB: ${mongoURI}`))
  .catch(err => console.error('❌ Error al conectar MongoDB:', err));

// =======================
// Rutas modularizadas
// =======================
const userRoutes = require('./routes/userRoutes');
app.use('/usuarios', userRoutes);

const menuRoutes = require('./routes/menuRoutes');
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
