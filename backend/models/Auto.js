const mongoose = require('mongoose');

const autoSchema = new mongoose.Schema({
  _id: String,
  nombre: String,
  año: Number,
  velocidad_maxima: String,
  imagen: String,
  fabricante_id: { type: String, ref: 'Fabricante' },
  disenador_id: { type: String, ref: 'Disenador' }
});

module.exports = mongoose.model('Auto', autoSchema);
