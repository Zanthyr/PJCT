const catchAsync = require('../utils/catchAsync');
const Company = require('./../models/companyModel');
const factory = require('./handlerFactory');
const AppError = require('../utils/appError');

exports.getAllCompanies = factory.getAll(Company);
exports.createCompany = factory.createOne(Company);
exports.softDeleteCompany = factory.softDelete(Company);
exports.deleteCompany = factory.deleteOne(Company);

exports.getCompany = catchAsync(async (req, res, next, popOptions) => {
  let query = Company.findById(req.params.id);
  if (popOptions) query = query.populate(popOptions);
  const doc = await query;

  if (!doc) {
    return next(new AppError('No Company found with that ID', 404));
  }

  if (req.user.company.id !== doc.id && req.user.role !== 'systemAdmin')
    return next(
      new AppError(
        'You can only request information for your own company!',
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

exports.updateCompany = catchAsync(async (req, res, next) => {
  const doc = await Company.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!doc) {
    return next(new AppError('No Company found with that ID', 404));
  }

  if (req.user.company.id !== doc.id && req.user.role !== 'systemAdmin')
    return next(new AppError('You can only update your own company!', 401));

  res.status(200).json({
    status: 'success',
    data: {
      data: doc,
    },
  });
});
