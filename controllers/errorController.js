const sendError = (err, res) => {
  console.log('BOOOOM ERROR', err.message, err, err.stack);
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  sendError(err, res);
  // Todo?  send individual error for dev and for production
};
