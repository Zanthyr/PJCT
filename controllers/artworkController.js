const catchAsync = require('../utils/catchAsync');
const Artwork = require('./../models/artworkModel');
const factory = require('./handlerFactory');

exports.getAllArtworks = factory.getAll(Artwork);
exports.getArtwork = factory.getOne(Artwork); // factory.getOne(Tour, { path: 'reviews' });
exports.createArtwork = factory.createOne(Artwork);
exports.updateArtwork = factory.updateOne(Artwork);
exports.softDeleteArtwork = factory.softDelete(Artwork);
exports.deleteArtwork = factory.deleteOne(Artwork);

exports.createArtworkOne = catchAsync(async (req, res, next) => {
  console.log('here');
  res.status(201).json({
    status: 'success',
    data: {
      data: [],
    },
  });
});

exports.addArtworkColors = catchAsync(async (req, res, next) => {
  console.log(req.params.id);
  res.status(201).json({
    status: 'success',
    data: {
      data: [],
    },
  });
});
