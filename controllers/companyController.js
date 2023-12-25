const catchAsync = require('../utils/catchAsync');
const Company = require('./../models/companyModel');
const factory = require('./handlerFactory');
const utils = require('../utils/utils');

exports.getCompany = factory.getOne(Company);
exports.getAllCompanies = factory.getAll(Company);
exports.updateCompany = factory.updateOne(Company);
exports.createCompany = factory.createOne(Company);
exports.softDeleteCompany = factory.softDelete(Company);
exports.deleteCompany = factory.deleteOne(Company);

exports.getMyCompany = (req, res, next) => {
  req.params.id = req.user.company.id;
  next();
};

exports.updateMyCompany = catchAsync(async (req, res, next) => {
  const filteredBody = utils.filterObj(req.body, 'companyName', 'adress');
  if (req.file) filteredBody.companyPhoto = req.file.filename;

  const doc = await Company.findByIdAndUpdate(
    req.user.company.id,
    filteredBody,
    {
      new: true,
      runValidators: true,
    },
  );

  res.status(200).json({
    status: 'success',
    data: {
      data: doc,
    },
  });
});
