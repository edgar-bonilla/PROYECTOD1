const mongoose = require('mongoose');

const fabricanteSchema = new mongoose.Schema({
  _id: String,
  nombre: { type: String, required: true },
  pais: { type: String, required: true },
  anio_fundacion: { type: Number, required: true },
  num_empleados: { type: Number, required: false },       // Nuevo campo
  sede_principal: { type: String, required: false },      // Nuevo campo
  imagen: { type: String, required: false }
});

module.exports = mongoose.model('Fabricante', fabricanteSchema);
