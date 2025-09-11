require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const autoRoutes = require('./routes/autos');
const fabricanteRoutes = require('./routes/fabricantes');
const disenadorRoutes = require('./routes/disenadores');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Conectado a MongoDB'))
.catch((err) => console.error('❌ Error de conexión:', err));

// Rutas
app.use('/api/autos', autoRoutes);
app.use('/api/fabricantes', fabricanteRoutes);
app.use('/api/disenadores', disenadorRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
