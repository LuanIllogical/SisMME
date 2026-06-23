const errorHandler = (error, req, res, next) => {
  const statusCode = error.name === 'ValidationError' ? 400 : 500;

  res.status(statusCode).json({
    message: error.message || 'Erro interno do servidor'
  });
};

module.exports = errorHandler;
