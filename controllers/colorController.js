const catchAsync = require('../utils/catchAsync');
const Color = require('./../models/colorModel');
const factory = require('./handlerFactory');
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');

exports.getAllColors = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Color.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const doc = await features.query;
  let newDoc = [];
  if (req.user.role !== 'systemAdmin') {
    newDoc = doc.filter((element) => {
      if (element.brandName.allowList.includes(req.user.company.id))
        return element;
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

exports.getColor = catchAsync(async (req, res, next, popOptions) => {
  let query = Color.findById(req.params.id);
  if (popOptions) query = query.populate(popOptions);
  const doc = await query;

  if (!doc) {
    return next(new AppError('No document found with that ID', 404));
  }
  console.log(doc.brandName.allowList);
  if (
    !doc.brandName.allowList.includes(req.user.company.id) &&
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

exports.createColor = catchAsync(async (req, res, next) => {
  req.body.createdBy = req.user.id;
  const doc = await Color.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      data: doc,
    },
  });
});

exports.updateColor = catchAsync(async (req, res, next) => {
  let query = Color.findById(req.params.id);

  if (!query) {
    return next(new AppError('No document found with that ID', 404));
  }

  if (
    req.user.company.id !== query.createdBy.company.id &&
    req.user.role !== 'systemAdmin'
  )
    return next(
      new AppError('You can only update colors for your own company!', 401),
    );

  const doc = await Color.findByIdAndUpdate(req.params.id, req.body, {
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

exports.softDeleteColor = factory.softDelete(Color);
exports.deleteColor = factory.deleteOne(Color);
