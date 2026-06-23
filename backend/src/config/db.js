const mongoose = require('mongoose');

const connectDB = async () => {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/sismme';

    try {
        await mongoose.connect(mongoUri);
        console.log('MongoDB conectado com sucesso');
    } catch (error) {
        console.error('Erro ao conectar ao MongoDB:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;

/*Esse arquivo é responsável por conectar o backend ao banco de dados MongoDB usando o Mongoose. Ele exporta uma função assíncrona connectDB que tenta estabelecer a conexão com o MongoDB usando a URI fornecida na variável de ambiente MONGO_URI. Se a conexão for bem-sucedida, uma mensagem de sucesso é exibida no console. Caso contrário, um erro é registrado e o processo é encerrado com um código de saída 1.*/
