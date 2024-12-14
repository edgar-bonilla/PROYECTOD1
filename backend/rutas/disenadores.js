const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

const getData = (fileName) => {
  const filePath = path.join(__dirname, '../data', fileName);
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
};

const saveData = (fileName, data) => {
  const filePath = path.join(__dirname, '../data', fileName);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

router.get('/', (req, res) => {
  const disenadores = getData('disenadores.json');
  res.json(disenadores);
});

router.get('/:id', (req, res) => {
  const disenadores = getData('disenadores.json');
  const disenador = disenadores.find(d => d.id === req.params.id);
  if (disenador) {
    res.json(disenador);
  } else {
    res.status(404).json({ error: 'Diseñador no encontrado' });
  }
});

router.post('/', (req, res) => {
  const disenadores = getData('disenadores.json');
  
  // Generar un nuevo ID único
  const nuevoId = (disenadores.length > 0) 
    ? (Math.max(...disenadores.map(d => parseInt(d.id))) + 1).toString() 
    : '1';

  const nuevoDisenador = {
    id: nuevoId,
    ...req.body 
  };

  disenadores.push(nuevoDisenador);
  saveData('disenadores.json', disenadores);
  res.status(201).json(nuevoDisenador);
});

router.put('/:id', (req, res) => {
  const disenadores = getData('disenadores.json');
  const index = disenadores.findIndex(d => d.id === req.params.id);
  if (index !== -1) {
    disenadores[index] = { id: req.params.id, ...req.body };
    saveData('disenadores.json', disenadores);
    res.json(disenadores[index]);
  } else {
    res.status(404).json({ error: 'Diseñador no encontrado' });
  }
});

router.delete('/:id', (req, res) => {
  let disenadores = getData('disenadores.json');
  const longitudInicial = disenadores.length;
  disenadores = disenadores.filter(d => d.id !== req.params.id);

  if (disenadores.length < longitudInicial) {
    saveData('disenadores.json', disenadores);
    res.status(200).json({ mensaje: 'Diseñador eliminado exitosamente' });
  } else {
    res.status(404).json({ error: 'Diseñador no encontrado' });
  }
});

module.exports = router;
