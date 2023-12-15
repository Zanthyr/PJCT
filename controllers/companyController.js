const sharp = require('sharp');
const multer = require('multer');
const catchAsync = require('../utils/catchAsync');
const Company = require('./../models/companyModel');
const factory = require('./handlerFactory');
const AppError = require('../utils/appError');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an immage, please only upload images', 400), false);
  }
};
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadCompanyPhoto = upload.single('photo');

exports.resizeCompanyPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();
  req.file.filename = `company-${req.user.id}-${Date.now()}.jpg`;
  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/companies/${req.file.filename}`);

  next();
});

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
  console.log(req.body.companyName);
  const filteredBody = filterObj(req.body, 'companyName');
  if (req.file) req.body.companyPhoto = req.file.filename;
  // else req.body.companyPhoto = req.user.company.companyPhoto;

  const doc = await Company.findByIdAndUpdate(req.user.company.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      data: doc,
    },
  });
});
