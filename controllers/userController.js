const catchAsync = require('../utils/catchAsync');
const User = require('./../models/userModel');

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  res.status(201).json({
    status: 'succes',
    results: users.length,
    data: { users }
  });
});

exports.createUser = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);
  res.status(201).json({
    status: 'succes',
    data: { user: newUser }
  });
});

exports.findUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(400).json({
      status: 'fail',
      message: 'no user found'
    });
    return;
  }
  res.status(201).json({
    status: 'succes',
    data: { user }
  });
});

// dont use for password
exports.updateUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!user) {
    res.status(400).json({
      status: 'fail',
      message: 'no user found'
    });
    return;
  }
  res.status(204).json({
    status: 'succes',
    data: { user }
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    res.status(400).json({
      status: 'fail',
      message: 'no user found'
    });
    return;
  }
  res.status(204).json({
    status: 'succes',
    data: null
  });
});
