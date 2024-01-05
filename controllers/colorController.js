const catchAsync = require('../utils/catchAsync');
const Color = require('./../models/colorModel');
const factory = require('./handlerFactory');
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');

// api and admin
exports.deleteColor = factory.deleteOne(Color);

exports.softDeleteColor = factory.softDelete(Color);

exports.getAllColors = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Color.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const doc = await features.query;
  let newDoc = [];
  if (req.user.role !== 'root') {
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

  if (
    !doc.brandName.allowList.includes(req.user.company.id) &&
    req.user.role !== 'root'
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

exports.createMyColor = catchAsync(async (req, res, next) => {
  const filteredBody = {};
  filteredBody.colorName = req.body.colorName;
  filteredBody.createdByUser = req.user.id;
  filteredBody.createdByCompany = req.user.company.id;

  if (req.body.brand.length === 0) {
    filteredBody.colorType = 'SpotColor';
  } else {
    filteredBody.brandName = req.body.brand;
  }

  filteredBody.values = {
    cie_L: req.body.cie_l,
    cie_a: req.body.cie_a,
    cie_b: req.body.cie_b,
    deltae00: req.body.deltae00,
    delta_c: req.body.delta_c,
    delta_h: req.body.delta_h,
    Density: req.body.dens,
    Halftone: req.body.halftone,
    Filter: req.body.filter,
    hex: req.body.hex,
  };

  const doc = await Color.create(filteredBody);

  res.status(201).json({
    status: 'success',
    data: {
      data: doc,
    },
  });
});

exports.updateColor = catchAsync(async (req, res, next) => {
  let query = await Color.findById(req.params.id);
  if (!query) {
    return next(new AppError('No document found with that ID', 404));
  }

  if (
    req.user.company.id !== query.createdByCompany &&
    req.user.role !== 'root'
  )
    return next(
      new AppError('You can only update colors for your own company!', 401),
    );

  const filteredBody = {};
  filteredBody.ColorVersion = query.ColorVersion;
  filteredBody.colorName = req.body.colorName;
  filteredBody.createdByUser = req.user.id;
  filteredBody.createdByCompany = req.user.company.id;

  if (req.body.brand.length === 0) {
    filteredBody.colorType = 'SpotColor';
  } else {
    filteredBody.brandName = req.body.brand;
  }

  // in future push the new object onto the values array and increment the verion number
  filteredBody.values = {
    cie_L: req.body.cie_l,
    cie_a: req.body.cie_a,
    cie_b: req.body.cie_b,
    deltae00: req.body.deltae00,
    delta_c: req.body.delta_c,
    delta_h: req.body.delta_h,
    Density: req.body.dens,
    Halftone: req.body.halftone,
    Filter: req.body.filter,
    hex: req.body.hex,
  };

  const doc = await Color.findByIdAndUpdate(req.params.id, filteredBody, {
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
