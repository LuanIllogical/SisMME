const mongoose = require('moongoose');
const connectDB = async () => {
    try {
        await mongoose.connnect(process.env.MONGO_URI);
        console.log('MongoDB conectado com sucesso');
    } catch (error) {
        console.error('Erro ao conectar ao MongoDB:', error.message);
        process.exit(1);
    }
}

module.exports = connectDB;