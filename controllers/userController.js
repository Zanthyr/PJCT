const User = require('./../models/userModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');
const utils = require('../utils/utils');

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined! Please use /signup instead',
  });
};

exports.getAllUsersOfCompany = catchAsync(async (req, res, next) => {
  req.query.company = req.user.company.id;
  const features = new APIFeatures(User.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const doc = await features.query;

  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: doc.length,
    data: {
      data: doc,
    },
  });
});

exports.getUserOfComapny = catchAsync(async (req, res, next, popOptions) => {
  let query = User.findById(req.params.id);
  if (popOptions) query = query.populate(popOptions);

  const doc = await query;

  if (!doc) {
    return next(new AppError('No document found with that ID', 404));
  }

  if (req.user.company.id !== doc.company.id)
    return next(
      new AppError(
        'You can only request user information for your own company!',
        401,
      ),
    );

  res.status(200).json({
    status: 'success',
    data: {
      data: doc,
    },
  });
});

exports.updateUserOfCompany = catchAsync(async (req, res, next) => {
  let query = User.findById(req.params.id);
  if (!query) {
    return next(new AppError('No document found with that ID', 404));
  }

  if (req.user.company.id !== query.company.id && req.user.role !== 'root')
    return next(
      new AppError('You can only update users for your own company!', 401),
    );

  const doc = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      data: doc,
    },
  });
});

exports.softDeleteUserOfCompany = catchAsync(async (req, res, next) => {
  const doc = await User.findByIdAndUpdate(req.params.id, { active: false });

  if (!doc) {
    return next(new AppError('No document found with that ID', 404));
  }

  if (req.user.company.id !== doc.company.id)
    return next(
      new AppError('You can only delte users for your own company!', 401),
    );

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword.',
        400,
      ),
    );
  }

  const filteredBody = utils.filterObj(req.body, 'userName', 'email');
  if (req.file) filteredBody.userPhoto = req.file.filename;
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.getUser = factory.getOne(User);

// admin only
exports.getAllUsers = factory.getAll(User);
exports.updateUser = factory.updateOne(User);
exports.softDeleteUser = factory.softDelete(User);
exports.deleteUser = factory.deleteOne(User);
