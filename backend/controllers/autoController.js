const Auto = require('../models/Auto');

exports.getAll = async (req, res) => {
  const autos = await Auto.find()
    .populate('fabricante_id')
    .populate('disenador_id');
  res.json(autos);
};

exports.getById = async (req, res) => {
  const auto = await Auto.findById(req.params.id)
    .populate('fabricante_id')
    .populate('disenador_id');
  res.json(auto);
};

exports.create = async (req, res) => {
  const nuevoAuto = new Auto(req.body);
  await nuevoAuto.save();
  res.status(201).json(nuevoAuto);
};

exports.update = async (req, res) => {
  const actualizado = await Auto.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(actualizado);
};

exports.remove = async (req, res) => {
  await Auto.findByIdAndDelete(req.params.id);
  res.json({ mensaje: 'Auto eliminado' });
};
