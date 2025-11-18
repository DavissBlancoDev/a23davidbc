const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  sexo: { type: String, enum: ['hombre','mujer','otro'], required: false }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
module.exports = User;