const mongoose = require('mongoose');

const disenadorSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  nombre: { type: String, required: true },
  nacionalidad: { type: String, required: true },
  estilo: { type: String, required: false },
  experiencia: { type: String, required: false }, 
  imagen: { type: String, required: false }
});

module.exports = mongoose.model('Disenador', disenadorSchema);