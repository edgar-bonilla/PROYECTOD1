const Disenador = require('../models/Disenador');

exports.getAll = async (req, res) => {
  const datos = await Disenador.find();
  res.json(datos);
};

exports.getById = async (req, res) => {
  const item = await Disenador.findById(req.params.id);
  res.json(item);
};

exports.create = async (req, res) => {
  const nuevo = new Disenador(req.body);
  await nuevo.save();
  res.status(201).json(nuevo);
};

exports.update = async (req, res) => {
  const actualizado = await Disenador.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(actualizado);
};

exports.remove = async (req, res) => {
  await Disenador.findByIdAndDelete(req.params.id);
  res.json({ mensaje: 'Diseñador eliminado' });
};
