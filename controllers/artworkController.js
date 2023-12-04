const catchAsync = require('../utils/catchAsync');
const Artwork = require('./../models/artworkModel');
const factory = require('./handlerFactory');

exports.getAllArtworks = factory.getAll(Artwork);
exports.getArtwork = factory.getOne(Artwork); // factory.getOne(Tour, { path: 'reviews' });
exports.createArtwork = factory.createOne(Artwork);
exports.updateArtwork = factory.updateOne(Artwork);
exports.deleteArtwork = factory.deleteOne(Artwork);
