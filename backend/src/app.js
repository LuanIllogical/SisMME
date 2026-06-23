const express = require('express');
const cors = require('cors');
const localRoutes = require('./routes/localRoutes');
const registroRoutes = require('./routes/registroRoutes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ message: 'API SisMME funcionando' });
});

app.use('/api/locais', localRoutes);
app.use('/api/registros', registroRoutes);

app.use(errorHandler);

module.exports = app;
