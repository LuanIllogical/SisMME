const mongoose = require('mongoose');

const registroMeteorologicoSchema = new mongoose.Schema(
  {
    local: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Local',
      required: true
    },
    dataHora: {
      type: Date,
      required: true,
      default: Date.now
    },
    temperatura: {
      type: Number,
      required: true
    },
    umidade: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    velocidadeVento: {
      type: Number,
      min: 0,
      default: 0
    },
    precipitacao: {
      type: Number,
      min: 0,
      default: 0
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('RegistroMeteorologico', registroMeteorologicoSchema);
