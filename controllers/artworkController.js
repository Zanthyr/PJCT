const catchAsync = require('../utils/catchAsync');
const Artwork = require('./../models/artworkModel');
const factory = require('./handlerFactory');
const utils = require('../utils/utils');
const Brand = require('./../models/brandModel');

exports.getAllArtworks = factory.getAll(Artwork);
exports.getArtwork = factory.getOne(Artwork);
exports.apiCreateArtwork = factory.createOne(Artwork);
exports.updateArtwork = factory.updateOne(Artwork);
exports.softDeleteArtwork = factory.softDelete(Artwork);
exports.deleteArtwork = factory.deleteOne(Artwork);

exports.createArtwork = catchAsync(async (req, res, next) => {
  const filteredBody = utils.filterObj(
    req.body,
    'artworkId',
    'artworkName',
    'artworkDescription',
  );

  if (req.body.artworkForBrand.length !== 0) {
    filteredBody.artworkForBrand = req.body.artworkForBrand;
    const brand = await Brand.findById(req.body.artworkForBrand);
    filteredBody.brandOwner = brand.brandOwner.id;
  }

  filteredBody.artworkCreator = req.user.id;
  filteredBody.createdByCompany = req.user.company.id;

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
    artworkImage: req.body.filename,
    artworkState: 2,
  });

  res.status(201).json({
    status: 'success',
    data: {
      data: [],
    },
  });
});

exports.addColors = catchAsync(async (req, res, next) => {
  await Artwork.findByIdAndUpdate(req.body.artworkId, {
    artworkColors: JSON.parse(req.body.colors),
    artworkState: 3,
  });

  res.status(201).json({
    status: 'success',
    data: {
      data: [],
    },
  });
});
