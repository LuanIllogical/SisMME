const express = require('express');
const {
  criarRegistro,
  listarRegistros
} = require('../controllers/registroController');

const router = express.Router();

router.get('/', listarRegistros);
router.post('/', criarRegistro);

module.exports = router;
