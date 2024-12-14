const express = require('express');
const cors = require('cors');
const automovilesRoutes = require('./rutas/automoviles'); 
const fabricantesRoutes = require('./rutas/fabricantes');
const diseñadoresRoutes = require('./rutas/disenadores');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Usamos las rutas
app.use('/api/automoviles', automovilesRoutes); // Cambiado de modelos a automoviles
app.use('/api/fabricantes', fabricantesRoutes);
app.use('/api/disenadores', diseñadoresRoutes);

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
