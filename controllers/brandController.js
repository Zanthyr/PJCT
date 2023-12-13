const catchAsync = require('../utils/catchAsync');
const Brand = require('./../models/brandModel');
const factory = require('./handlerFactory');
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');

exports.getBrand = catchAsync(async (req, res, next, popOptions) => {
  let query = Brand.findById(req.params.id);
  if (popOptions) query = query.populate(popOptions);
  const doc = await query;

  if (!doc) {
    return next(new AppError('No document found with that ID', 404));
  }

  if (
    !doc.allowList.includes(req.user.company.id) &&
    req.user.role !== 'systemAdmin'
  )
    return next(
      new AppError(
        'You can only request brand ower info if your company has acces!',
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

exports.getAllBrands = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Brand.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const doc = await features.query;
  let newDoc = [];
  if (req.user.role !== 'systemAdmin') {
    newDoc = doc.filter((element) => {
      if (element.allowList.includes(req.user.company.id)) return element;
    });
  } else {
    newDoc = doc;
  }
  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: newDoc.length,
    data: {
      data: newDoc,
    },
  });
});

// company admin onplay
exports.createBrand = catchAsync(async (req, res, next) => {
  if (req.user.role !== 'systemAdmin')
    req.body.brandOwner = req.user.company.id;
  const doc = await Brand.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      data: doc,
    },
  });
});

exports.updateBrand = catchAsync(async (req, res, next) => {
  const doc = await Brand.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!doc) {
    return next(new AppError('No document found with that ID', 404));
  }

  if (req.user.company.id !== doc.brandOwner && req.user.role !== 'systemAdmin')
    return next(
      new AppError('You can only update users for your own company!', 401),
    );

  res.status(200).json({
    status: 'success',
    data: {
      data: doc,
    },
  });
});

//sysadmin only

exports.softDeleteBrand = factory.softDelete(Brand);
exports.deleteBrand = factory.deleteOne(Brand);
