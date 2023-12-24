const catchAsync = require('../utils/catchAsync');
const Artwork = require('./../models/artworkModel');
const factory = require('./handlerFactory');
const utils = require('../utils/utils');
const Company = require('./../models/companyModel');
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
  filteredBody.createdByCompany =
    req.user.role === 'root' ? req.body.company : req.user.company.id;

  const artwork = await Artwork.create(filteredBody);

  res.status(201).json({
    status: 'success',
    data: {
      data: artwork,
    },
  });
});

exports.addImage = catchAsync(async (req, res, next) => {
  console.log(req.body.filename, req.body.artworkId);
  await Artwork.findByIdAndUpdate(req.body.artworkId, {
    artworkImage: req.body.filename,
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
    artworkColors: req.body.colors.split(','),
  });

  res.status(201).json({
    status: 'success',
    data: {
      data: [],
    },
  });
});
