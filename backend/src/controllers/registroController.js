const RegistroMeteorologico = require('../models/RegistroMeteorologico');

const listarRegistros = async (req, res, next) => {
  try {
    const filtro = {};
    if (req.query.local) filtro.local = req.query.local;
    if (req.query.dataInicio || req.query.dataFim) {
      filtro.dataHora = {};
      if (req.query.dataInicio) filtro.dataHora.$gte = new Date(req.query.dataInicio);
      if (req.query.dataFim)    filtro.dataHora.$lte = new Date(req.query.dataFim + 'T23:59:59');
    }
    if (req.query.tempMin || req.query.tempMax) {
      filtro.temperatura = {};
      if (req.query.tempMin) filtro.temperatura.$gte = Number(req.query.tempMin);
      if (req.query.tempMax) filtro.temperatura.$lte = Number(req.query.tempMax);
    }
    const registros = await RegistroMeteorologico.find(filtro)
      .populate('local')
      .sort({ dataHora: -1 });
    res.json(registros);
  } catch (error) { next(error); }
};

const criarRegistro = async (req, res, next) => {
  try {
    const registro = await RegistroMeteorologico.create(req.body);
    const registroCompleto = await registro.populate('local');
    res.status(201).json(registroCompleto);
  } catch (error) { next(error); }
};

const excluirRegistro = async (req, res, next) => {
  try {
    const registro = await RegistroMeteorologico.findByIdAndDelete(req.params.id);
    if (!registro) return res.status(404).json({ erro: 'Registro não encontrado' });
    res.status(204).end();
  } catch (error) { next(error); }
};

module.exports = { listarRegistros, criarRegistro, excluirRegistro };
