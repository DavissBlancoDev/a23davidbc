const mongoose = require('mongoose');

const platoSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  nombre: { type: String, required: true },
  ingredientes: {
    type: Map,
    of: String,
    default: {}
  }
}, { _id: false });

const menuSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  platos: {
    type: [platoSchema],
    validate: [
      val => val.length >= 1 && val.length <= 3,
      'Debe haber entre 1 y 3 platos'
    ]
  }
}, { timestamps: true });

const Menu = mongoose.model('Menu', menuSchema);
module.exports = Menu;
