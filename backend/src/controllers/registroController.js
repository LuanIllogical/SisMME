const RegistroMeteorologico = require('../models/RegistroMeteorologico');

const listarRegistros = async (req, res, next) => {
  try {
    const registros = await RegistroMeteorologico.find()
      .populate('local')
      .sort({ dataHora: -1 });

    res.json(registros);
  } catch (error) {
    next(error);
  }
};

const criarRegistro = async (req, res, next) => {
  try {
    const registro = await RegistroMeteorologico.create(req.body);
    const registroCompleto = await registro.populate('local');
    res.status(201).json(registroCompleto);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listarRegistros,
  criarRegistro
};
