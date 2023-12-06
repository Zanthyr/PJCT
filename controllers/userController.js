const catchAsync = require('../utils/catchAsync');
const User = require('./../models/userModel');
const factory = require('./handlerFactory');

exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(User); // factory.getOne(Tour, { path: 'reviews' });
exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined! Please use /signup instead',
  });
};
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);
