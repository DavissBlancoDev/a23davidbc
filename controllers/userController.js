const User = require('../models/user');
const bcrypt = require('bcrypt');

// =====================
// Registrar usuario
// =====================
exports.registerUser = async (req, res) => {
  try {
    const { nombre, email, password, sexo } = req.body;
    if (!nombre || !email || !password) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'Email ya registrado' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ nombre, email, password: hashedPassword, sexo });
    await newUser.save();

    res.status(201).json({ message: 'Usuario registrado', usuarioId: newUser._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// =====================
// Editar perfil
// =====================
exports.editarPerfil = async (req, res) => {
  try {
    const { userId, nombre, email, sexo } = req.body;
    if (!userId) return res.status(400).json({ error: "Falta ID de usuario" });

    const usuario = await User.findById(userId);
    if (!usuario) return res.status(404).json({ error: "Usuario no encontrado" });

    usuario.nombre = nombre || usuario.nombre;
    usuario.email = email || usuario.email;
    usuario.sexo = sexo || usuario.sexo;

    await usuario.save();
    res.json({ message: "Perfil actualizado correctamente", usuario });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// =====================
// Cambiar contraseña
// =====================
exports.cambiarContrasena = async (req, res) => {
  try {
    const { userId, currentPassword, newPassword } = req.body;
    if (!userId || !currentPassword || !newPassword) {
      return res.status(400).json({ error: "Faltan datos obligatorios" });
    }

    const usuario = await User.findById(userId);
    if (!usuario) return res.status(404).json({ error: "Usuario no encontrado" });

    const isMatch = await bcrypt.compare(currentPassword, usuario.password);
    if (!isMatch) return res.status(400).json({ error: "Contraseña actual incorrecta" });

    const salt = await bcrypt.genSalt(10);
    usuario.password = await bcrypt.hash(newPassword, salt);
    await usuario.save();

    res.json({ message: "Contraseña actualizada correctamente" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// =====================
// Obtener datos de usuario
// =====================
exports.obtenerUsuario = async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!userId) return res.status(400).json({ error: "Falta ID de usuario" });

    const usuario = await User.findById(userId).select("-password");
    if (!usuario) return res.status(404).json({ error: "Usuario no encontrado" });

    res.json(usuario);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// =====================
// Login usuario
// =====================
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Faltan datos obligatorios" });

    const usuario = await User.findOne({ email });
    if (!usuario) return res.status(404).json({ error: "Usuario no encontrado" });

    const isMatch = await bcrypt.compare(password, usuario.password);
    if (!isMatch) return res.status(400).json({ error: "Contraseña incorrecta" });

    res.json({ 
      message: "Login exitoso", 
      usuarioId: usuario._id,
      nombre: usuario.nombre
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
