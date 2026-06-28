const Local = require('../models/Local');

const listarLocais = async (req, res, next) => {
  try {
    const filtro = {};
    if (req.query.ativo !== undefined) filtro.ativo = req.query.ativo === 'true';
    const locais = await Local.find(filtro).sort({ nome: 1 });
    res.json(locais);
  } catch (error) { next(error); }
};

const criarLocal = async (req, res, next) => {
  try {
    const local = await Local.create(req.body);
    res.status(201).json(local);
  } catch (error) { next(error); }
};

const alterarStatus = async (req, res, next) => {
  try {
    const local = await Local.findByIdAndUpdate(
      req.params.id,
      { ativo: req.body.ativo },
      { new: true }
    );
    if (!local) return res.status(404).json({ erro: 'Local não encontrado' });
    res.json(local);
  } catch (error) { next(error); }
};

module.exports = { listarLocais, criarLocal, alterarStatus };
