const express = require('express');
const { criarLocal, listarLocais, alterarStatus } = require('../controllers/localController');

const router = express.Router();

router.get('/',      listarLocais);
router.post('/',     criarLocal);
router.patch('/:id', alterarStatus);

module.exports = router;
