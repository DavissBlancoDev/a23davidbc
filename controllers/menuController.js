const Menu = require('../models/menu');

// Crear un menú
exports.crearMenu = async (req, res) => {
  try {
    const { nombre, platos, usuarioId } = req.body;

    if (!nombre || !platos || platos.length === 0) {
      return res.status(400).json({ error: 'Nombre y al menos un plato son obligatorios.' });
    }

    const nuevoMenu = new Menu({ nombre, platos, usuarioId });
    await nuevoMenu.save();

    res.status(201).json({ message: 'Menú creado correctamente', menu: nuevoMenu });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear el menú' });
  }
};

// Obtener todos los menús de un usuario
exports.obtenerMenusUsuario = async (req, res) => {
  try {
    const { usuarioId } = req.params;
    const menus = await Menu.find({ usuarioId });
    res.json(menus);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener los menús' });
  }
};

// Obtener un menú por ID (solo si pertenece al usuario)
exports.obtenerMenu = async (req, res) => {
  try {
    const { id } = req.params;
    const { usuarioId } = req.query;

    const menu = await Menu.findOne({ _id: id, usuarioId });
    if (!menu) return res.status(404).json({ error: 'Menú no encontrado' });

    res.json(menu);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener el menú' });
  }
};

// Modificar un menú (solo si pertenece al usuario)
exports.editarMenu = async (req, res) => {
  try {
    const { id } = req.params;
    const { usuarioId, nombre, platos } = req.body;

    const menu = await Menu.findOneAndUpdate(
      { _id: id, usuarioId },
      { nombre, platos },
      { new: true }
    );

    if (!menu) return res.status(404).json({ error: 'Menú no encontrado o no tienes permisos' });

    res.json({ message: 'Menú actualizado correctamente', menu });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al editar el menú' });
  }
};

// Borrar un menú (solo si pertenece al usuario)
exports.borrarMenu = async (req, res) => {
  try {
    const { id } = req.params;
    const { usuarioId } = req.query;

    const menu = await Menu.findOneAndDelete({ _id: id, usuarioId });
    if (!menu) return res.status(404).json({ error: 'Menú no encontrado o no tienes permisos' });

    res.json({ message: 'Menú eliminado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al borrar el menú' });
  }
};
