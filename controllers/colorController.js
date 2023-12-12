const catchAsync = require('../utils/catchAsync');
const Color = require('./../models/colorModel');
const factory = require('./handlerFactory');

exports.getAllColors = factory.getAll(Color);
exports.getColor = factory.getOne(Color); // factory.getOne(Tour, { path: 'reviews' });
exports.createColor = factory.createOne(Color);
exports.updateColor = factory.updateOne(Color);
exports.softDeleteColor = factory.softDelete(Color);
exports.deleteColor = factory.deleteOne(Color);
