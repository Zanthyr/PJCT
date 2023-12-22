const catchAsync = require('../utils/catchAsync');
const Artwork = require('./../models/artworkModel');
const factory = require('./handlerFactory');
const utils = require('../utils/utils');

exports.getAllArtworks = factory.getAll(Artwork);
exports.getArtwork = factory.getOne(Artwork);
exports.apiCreateArtwork = factory.createOne(Artwork);
exports.updateArtwork = factory.updateOne(Artwork);
exports.softDeleteArtwork = factory.softDelete(Artwork);
exports.deleteArtwork = factory.deleteOne(Artwork);

exports.createArtwork = catchAsync(async (req, res, next) => {
  const filteredBody = utils.filterObj(
    req.body,
    'brand',
    'artworkId',
    'artworkName',
    'artworkDescription',
  );

  filteredBody.artworkCreator = req.user.id;
  filteredBody.createdByCompany =
    req.user.role === 'root' ? req.body.company : req.user.company.id;
  console.log('here');
  const artwork = await Artwork.create(filteredBody);

  res.status(201).json({
    status: 'success',
    data: {
      data: artwork,
    },
  });
});

exports.addImage = catchAsync(async (req, res, next) => {
  await Artwork.findByIdAndUpdate(req.body.artworkId, {
    artworkImage: req.file.filename,
  });
  res.status(201).json({
    status: 'success',
    data: {
      data: [],
    },
  });
});

exports.addColors = catchAsync(async (req, res, next) => {
  res.status(201).json({
    status: 'success',
    data: {
      data: [],
    },
  });
});
