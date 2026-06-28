const express = require('express');
const { criarRegistro, listarRegistros, excluirRegistro } = require('../controllers/registroController');

const router = express.Router();

router.get('/',       listarRegistros);
router.post('/',      criarRegistro);
router.delete('/:id', excluirRegistro);

module.exports = router;
