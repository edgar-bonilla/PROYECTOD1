const Fabricante = require('../models/Fabricante');

exports.getAll = async (req, res) => {
  const datos = await Fabricante.find();
  res.json(datos);
};

exports.getById = async (req, res) => {
  const item = await Fabricante.findById(req.params.id);
  res.json(item);
};

exports.create = async (req, res) => {
  const nuevo = new Fabricante(req.body);
  await nuevo.save();
  res.status(201).json(nuevo);
};

exports.update = async (req, res) => {
  const actualizado = await Fabricante.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(actualizado);
};

exports.remove = async (req, res) => {
  await Fabricante.findByIdAndDelete(req.params.id);
  res.json({ mensaje: 'Fabricante eliminado' });
};
