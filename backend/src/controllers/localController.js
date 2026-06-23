const Local = require('../models/Local');

const listarLocais = async (req, res, next) => {
  try {
    const locais = await Local.find().sort({ nome: 1 });
    res.json(locais);
  } catch (error) {
    next(error);
  }
};

const criarLocal = async (req, res, next) => {
  try {
    const local = await Local.create(req.body);
    res.status(201).json(local);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listarLocais,
  criarLocal
};
