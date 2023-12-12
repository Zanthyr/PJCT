const catchAsync = require('../utils/catchAsync');
const Brand = require('./../models/brandModel');
const factory = require('./handlerFactory');

exports.getAllBrands = factory.getAll(Brand);
exports.getBrand = factory.getOne(Brand); // factory.getOne(Tour, { path: 'reviews' });
exports.createBrand = factory.createOne(Brand);
exports.updateBrand = factory.updateOne(Brand);
exports.softDeleteBrand = factory.softDelete(Brand);
exports.deleteBrand = factory.deleteOne(Brand);
