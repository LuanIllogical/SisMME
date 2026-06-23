const express = require('express');
const { criarLocal, listarLocais } = require('../controllers/localController');

const router = express.Router();

router.get('/', listarLocais);
router.post('/', criarLocal);

module.exports = router;
