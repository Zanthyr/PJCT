const sendError = (err, res) => {
  console.log('here too', err.statusCode);
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  sendError(err, res);
  // Todo?  send individual error for dev and for production
};
