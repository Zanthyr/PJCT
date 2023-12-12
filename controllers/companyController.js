const catchAsync = require('../utils/catchAsync');
const Company = require('./../models/companyModel');
const factory = require('./handlerFactory');

exports.getAllCompanies = factory.getAll(Company);
exports.getCompany = factory.getOne(Company); // factory.getOne(Tour, { path: 'reviews' });
exports.createCompany = factory.createOne(Company);
exports.updateCompany = factory.updateOne(Company);
exports.softDeleteCompany = factory.softDelete(Company);
exports.deleteCompany = factory.deleteOne(Company);
