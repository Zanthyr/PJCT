const catchAsync = require('../utils/catchAsync');
const User = require('./../models/userModel');
const Color = require('./../models/colorModel');
const Brand = require('./../models/brandModel');
const Artworks = require('./../models/artworkModel');
const Company = require('./../models/companyModel');
const APIFeatures = require('../utils/apiFeatures');
const Artwork = require('./../models/artworkModel');
const crypto = require('crypto');
const Job = require('./../models/jobModel');

exports.getHome = catchAsync(async (req, res, next) => {
  let myArtworks = [];
  if (res.locals.user) {
    if (
      res.locals.user.role !== 'root' &&
      res.locals.user.company.companyType !== 'BrandOwner'
    )
      req.query.createdByCompany = res.locals.user.company.id;
    if (
      res.locals.user.role !== 'root' &&
      res.locals.user.company.companyType === 'BrandOwner'
    )
      req.query.brandOwner = res.locals.user.company.id;

    const features = new APIFeatures(Artworks.find(), req.query).filter();
    myArtworks = await features.query;
  }

  res.status(200).render('home', {
    title: 'Home',
    myArtworks,
  });
});

exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Log into your account',
  });
};

exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your user account',
    activeMenu: 'My Acount',
  });
};

exports.requestReset = (req, res) => {
  res.status(200).render('requestReset', {
    title: 'Request Password reset',
  });
};

exports.resetPassword = (req, res) => {
  res.status(200).render('resetPassword', {
    title: 'Reset Password',
  });
};

exports.getCompany = catchAsync(async (req, res) => {
  let query = Company.findById(req.user.company.id);
  const doc = await query;
  res.status(200).render('company', {
    title: 'Your company account',
    activeMenu: 'My Company',
    company: doc,
  });
});

exports.getCompanies = catchAsync(async (req, res) => {
  const features = new APIFeatures(Company.find(), req.query).filter();
  const doc = await features.query;

  res.status(200).render('companies', {
    activeMenu: 'Manage companies',
    title: 'manage Companies',
    companies: doc,
  });
});

exports.updateUserData = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.userName,
      email: req.body.email,
    },
    {
      new: true,
      runValidators: true,
    },
  );

  res.status(200).render('account', {
    title: 'Your account',
    user: updatedUser,
  });
});

exports.getUsers = catchAsync(async (req, res, next) => {
  if (req.user.role !== 'root') req.query.company = req.user.company.id;
  const features = new APIFeatures(User.find(), req.query).filter();
  const doc = await features.query;

  const newDoc = doc.map((item) => ({
    name: item.userName,
    company: item.company.companyName,
    photo: item.userPhoto,
    email: item.email,
    role: item.role,
    artwork: item.artworkCreator,
    job: item.jobCreator,
    date: item.createdAt.toLocaleDateString('en-us', {
      year: 'numeric',
      month: 'short',
    }),
    id: item.id,
  }));

  let allCompanies = [];
  if (req.user.role === 'root') {
    const companies = await Company.find();
    allCompanies = companies.map((item) => ({
      name: item.companyName,
      id: item.id,
    }));
  }

  res.status(200).render('users', {
    activeMenu: 'Manage users',
    title: 'Manage users',
    newDoc,
    allCompanies,
  });
});

exports.getBrands = catchAsync(async (req, res, next) => {
  const doc = await Brand.find();

  const newDoc =
    req.user.role !== 'root'
      ? doc.filter((element) => element.allowList.includes(req.user.company.id))
      : doc;

  let cleanCompanies = [];
  if (
    req.user.role === 'root' ||
    req.user.company.companyType === 'BrandOwner'
  ) {
    const companies = await Company.find();
    cleanCompanies = companies.map((item) => ({
      name: item.companyName,
      id: item.id,
    }));
  }

  const cleanDoc = newDoc.map((item) => ({
    name: item.brandName,
    logo: item.brandLogo,
    groep: item.productGroup,
    Brandowner: item.brandOwner.companyName,
    brandManagers: item.brandManagers.map((manager) => ({
      companyName: manager.companyName,
    })),
    brandSuppliers: item.brandSuppliers.map((supplier) => ({
      companyName: supplier.companyName,
    })),
    date: item.createdAt.toLocaleDateString('en-us', {
      year: 'numeric',
      month: 'short',
    }),
    id: item.id,
  }));

  res.status(200).render('brands', {
    activeMenu: 'Manage Brands',
    title: 'Manage Brands',
    cleanDoc,
    cleanCompanies,
  });
});

exports.getColors = catchAsync(async (req, res, next) => {
  const allSpotColors = await Color.find({
    createdByCompany: req.user.company.id,
    colorType: 'SpotColor',
  });
  const allBrandColors = await Color.find({ colorType: 'BrandColor' });
  const allBrands = await Brand.find();

  let myBrandColorsList = [];
  let myBrandList = [];
  let myColorsList = [];
  if (req.user.role !== 'root') {
    myBrandColorsList = allBrandColors.filter((element) =>
      element.brandName.allowList.includes(req.user.company.id),
    );
    myBrandList = allBrands.filter((element) =>
      element.managerList.includes(req.user.company.id),
    );
    myColorsList = [...allSpotColors, ...myBrandColorsList];
  } else {
    myColorsList = await Color.find();
    myBrandList = allBrands;
  }

  const cleanColorList = myColorsList.map((item) => ({
    name: item.colorName,
    groep: item.colorType,
    id: item.id,
    brand: item.brandName === undefined ? 'none' : item.brandName.brandName,
    hex: item.values[item.ColorVersion].hex,
    date: item.createdAt,
  }));

  const cleanBrandList = myBrandList.map((item) => ({
    name: item.brandName,
    groep: item.productGroup,
    id: item.id,
  }));

  res.status(200).render('colors', {
    activeMenu: 'Manage Colwors',
    title: 'Manage Colors',
    cleanColorList,
    cleanBrandList,
  });
});

exports.editColor = catchAsync(async (req, res, next) => {
  const color = await Color.findById(req.params.id);
  const allBrands = await Brand.find();

  let myBrandList = [];
  if (req.user.role !== 'root') {
    myBrandList = allBrands.filter((element) =>
      element.managerList.includes(req.user.company.id),
    );
  } else {
    myBrandList = allBrands;
  }

  const cleanBrandList = myBrandList.map((item) => ({
    name: item.brandName,
    groep: item.productGroup,
    id: item.id,
  }));

  res.status(200).render('editColor', {
    activeMenu: 'Manage Colors',
    title: 'Edit Color',
    cleanBrandList,
    color,
  });
});

// wegdoen?
exports.addArtworkData = catchAsync(async (req, res, next) => {
  const allBrands = await Brand.find();
  const myBrands = allBrands.filter((element) =>
    element.allowList.includes(req.user.company.id),
  );

  const brandList = myBrands.map((item) => ({
    name: item.brandName,
    groep: item.productGroup,
    id: item.id,
  }));

  res.status(200).render('addArtData', {
    title: 'add Artwork Data',
    brandList,
  });
});

exports.addArtworkImage = catchAsync(async (req, res, next) => {
  res.status(200).render('addArtImage', {
    title: 'Add Artwork Image',
    id: req.params.id,
  });
});

exports.addArtworkColors = catchAsync(async (req, res, next) => {
  const artwork = await Artwork.findById(req.params.id);
  let spotColors;
  let brandColors = [];

  if (artwork.artworkForBrand) {
    brandColors = artwork.artworkForBrand.id
      ? (
          await Color.find({
            brandName: artwork.artworkForBrand.id,
          })
        ).map((item) => ({
          name: item.colorName,
          brand: item.brandName.brandName,
          id: item.id,
        }))
      : [];
  }

  if (req.user.role === 'root') {
    spotColors = await Color.find({
      colorType: 'SpotColor',
    });
  } else {
    spotColors = await Color.find({
      colorType: 'SpotColor',
      createdByCompany: req.user.company.id,
    });
  }

  const myColors = [
    ...brandColors,
    ...spotColors.map((item) => ({
      name: item.colorName,
      id: item.id,
    })),
  ];

  res.status(200).render('addArtColors', {
    title: 'Add Artwork Colors',
    colors: myColors,
    artwork,
  });
});

exports.addJob = catchAsync(async (req, res, next) => {
  const artworkId = req.params.id;

  res.status(200).render('addJob', {
    title: 'Add Job',
    artworkId: artworkId,
  });
});

exports.submitJob = catchAsync(async (req, res, next) => {
  const submitJobToken = req.params.token;

  const job = await Job.findOne({
    submitJobToken, //: hashedToken,
    submitJobExpires: { $gt: Date.now() },
  });

  // 2) If token has not expired, and there is user, set the new password
  if (!job) {
    return next(new AppError('Token is invalid or has expired', 400));
  }

  console.log(job);
  res.status(200).render('submitJob', {
    title: 'submit A Job',
    job,
  });
});
