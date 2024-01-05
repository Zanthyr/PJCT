const sharp = require('sharp');
const multer = require('multer');
const catchAsync = require('./catchAsync');
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

exports.uploadFile = upload.single('file');
exports.uploadImageFile = upload.single('photo');
exports.uploadFields = upload.single('fileFieldName');

exports.resizeArtworkImage = catchAsync(async (req, res, next) => {
  if (!req.body.photo) return next();
  const imageBuffer = Buffer.from(req.body.photo.split(',')[1], 'base64');
  req.body.filename = `artwork-${req.body.artworkId}-${Date.now()}.jpg`;

  await sharp(imageBuffer)
    .resize({ width: 2000, height: 2000, fit: 'inside' })
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/artworks/${req.body.filename}`);

  next();
});

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();
  req.file.filename = `user-${req.user.id}-${Date.now()}.jpg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);

  next();
});

exports.resizeCompanyPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();
  req.file.filename = `company-${req.user.company.id}-${Date.now()}.jpg`;

  await sharp(req.file.buffer)
    //.resize(800, 300)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/companies/${req.file.filename}`);

  next();
});

exports.resizeBrandLogo = catchAsync(async (req, res, next) => {
  if (!req.file) return next();
  req.file.filename = `brand-${req.user.company.id}-${Date.now()}.jpg`; //// company id lijkt mij n iet het correcte om te gebruiken hier

  await sharp(req.file.buffer)
    .resize(250, 100)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/brands/${req.file.filename}`);

  next();
});
