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
  const automoviles = getData('automoviles.json');
  res.json(automoviles);
});

router.get('/:id', (req, res) => {
  const automoviles = getData('automoviles.json');
  const automovil = automoviles.find(a => a.id === req.params.id);
  if (automovil) {
    res.json(automovil);
  } else {
    res.status(404).send('Automóvil no encontrado');
  }
});

router.post('/', (req, res) => {
  const automoviles = getData('automoviles.json');
  const nuevoId = automoviles.length > 0 ? (Math.max(...automoviles.map(a => parseInt(a.id))) + 1).toString() : '1';
  const nuevoAutomovil = { id: nuevoId, ...req.body };
  automoviles.push(nuevoAutomovil);
  saveData('automoviles.json', automoviles);
  res.status(201).json(nuevoAutomovil);
});

router.put('/:id', (req, res) => {
  const automoviles = getData('automoviles.json');
  const index = automoviles.findIndex(a => a.id === req.params.id);
  if (index !== -1) {
    const automovilActualizado = { ...automoviles[index], ...req.body, id: req.params.id };
    automoviles[index] = automovilActualizado;
    saveData('automoviles.json', automoviles);
    res.json(automovilActualizado);
  } else {
    res.status(404).send('Automóvil no encontrado');
  }
});

router.delete('/:id', (req, res) => {
  let fabricantes = getData('fabricantes.json');
  const longitudInicial = fabricantes.length;
  

  fabricantes = fabricantes.filter(f => f.id !== req.params.id);
  
  if (fabricantes.length < longitudInicial) {
    saveData('fabricantes.json', fabricantes);
    res.status(200).json({ mensaje: 'Fabricante eliminado exitosamente' });
  } else {
    res.status(404).json({ error: 'Fabricante no encontrado' });
  }
});

module.exports = router;
