const mongoose = require('mongoose');
const RegistroMeteorologico = require('../models/RegistroMeteorologico');

const listarRegistros = async (req, res, next) => {
  try {
    const filtro = {};
    
    if (req.query.local) filtro.local = req.query.local;
    if (req.query.dataInicio || req.query.dataFim) {
      filtro.dataHora = {};
      if (req.query.dataInicio) filtro.dataHora.$gte = new Date(req.query.dataInicio);
      if (req.query.dataFim) filtro.dataHora.$lte = new Date(req.query.dataFim + 'T23:59:59');
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
  } catch (error) {
    console.error('❌ Erro ao listar registros:', error);
    next(error);
  }
};

const criarRegistro = async (req, res, next) => {
  try {
    console.log('📥 Dados recebidos no backend:', JSON.stringify(req.body, null, 2));
    
    // VALIDAÇÃO
    if (!req.body.local) {
      return res.status(400).json({ 
        message: 'Campo "local" é obrigatório' 
      });
    }
    
    // Verificar se o ID do local é válido
    if (!mongoose.Types.ObjectId.isValid(req.body.local)) {
      return res.status(400).json({ 
        message: 'ID do local inválido', 
        valor: req.body.local 
      });
    }
    
    // Verificar campos obrigatórios
    const camposObrigatorios = ['dataHora', 'temperatura', 'umidade'];
    const faltando = camposObrigatorios.filter(campo => 
      req.body[campo] === undefined || req.body[campo] === null || req.body[campo] === ''
    );
    
    if (faltando.length > 0) {
      return res.status(400).json({ 
        message: 'Campos obrigatórios faltando', 
        campos: faltando 
      });
    }
    
    // CONSTRUIR OBJETO PARA SALVAR - SOMENTE CAMPOS DO REGISTRO
    const dadosRegistro = {
      local: req.body.local, // O ObjectId do local
      dataHora: new Date(req.body.dataHora),
      temperatura: Number(req.body.temperatura),
      umidade: Number(req.body.umidade)
    };
    
    // Campos opcionais
    if (req.body.velocidadeVento !== undefined && 
        req.body.velocidadeVento !== null && 
        req.body.velocidadeVento !== '') {
      dadosRegistro.velocidadeVento = Number(req.body.velocidadeVento);
    }
    
    if (req.body.precipitacao !== undefined && 
        req.body.precipitacao !== null && 
        req.body.precipitacao !== '') {
      dadosRegistro.precipitacao = Number(req.body.precipitacao);
    }
    
    console.log('📦 Dados processados para salvar:', JSON.stringify(dadosRegistro, null, 2));
    
    // CRIAR REGISTRO - USANDO O MODELO CORRETO
    const registro = new RegistroMeteorologico(dadosRegistro);
    const registroSalvo = await registro.save();
    
    // POPULAR O LOCAL
    const registroCompleto = await RegistroMeteorologico.findById(registroSalvo._id).populate('local');
    
    console.log('✅ Registro criado com sucesso:', registroCompleto._id);
    
    res.status(201).json(registroCompleto);
  } catch (error) {
    console.error('❌ Erro ao criar registro:', error);
    
    // Erro de validação do Mongoose
    if (error.name === 'ValidationError') {
      const mensagens = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        message: 'Erro de validação', 
        erros: mensagens 
      });
    }
    
    // Erro de cast (ID inválido)
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        message: 'Erro de conversão de tipo', 
        campo: error.path,
        valor: error.value 
      });
    }
    
    next(error);
  }
};

const excluirRegistro = async (req, res, next) => {
  try {
    const registro = await RegistroMeteorologico.findByIdAndDelete(req.params.id);
    if (!registro) {
      return res.status(404).json({ erro: 'Registro não encontrado' });
    }
    res.status(204).end();
  } catch (error) {
    console.error('❌ Erro ao excluir registro:', error);
    next(error);
  }
};

module.exports = { listarRegistros, criarRegistro, excluirRegistro };