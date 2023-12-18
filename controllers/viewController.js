const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const User = require('./../models/userModel');
const Color = require('./../models/colorModel');
const Brand = require('./../models/brandModel');
const Company = require('./../models/companyModel');
const APIFeatures = require('../utils/apiFeatures');

exports.getHome = catchAsync(async (req, res, next) => {
  // 1) Get tour data from collection
  // 2) Build template
  // 3) Render that template using tour data from 1)
  res.status(200).render('home', {
    title: 'Home',
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

exports.pwdReset = (req, res) => {
  res.status(200).render('pwdreset', {
    title: 'password Reset',
  });
};

exports.resetPassword = (req, res) => {
  res.status(200).render('resetPassword', {
    title: 'choose new pwd',
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

  const features = new APIFeatures(User.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
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

  res.status(200).render('users', {
    title: 'Manage users',
    newDoc,
    activeMenu: 'Manage users',
  });
});

exports.getBrands = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Brand.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const doc = await features.query;

  let newDoc = [];
  if (req.user.role !== 'root')
    newDoc = doc.filter((element) => {
      if (element.allowList.includes(req.user.company.id)) return element;
    });
  else newDoc = doc;

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
    groep: item.productGroup,
    Brandowner: item.brandOwner.companyName,
    brandManagers: item.brandManagers.map((item) => [item.companyName]),
    brandSuppliers: item.brandSuppliers.map((item) => [item.companyName]),
    date: item.createdAt.toLocaleDateString('en-us', {
      year: 'numeric',
      month: 'short',
    }),
    id: item.id,
  }));
  res.status(200).render('brands', {
    title: 'Manage Brands',
    cleanDoc,
    cleanCompanies,
    activeMenu: 'Manage Brands',
  });
});

exports.getColors = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Color.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const doc = await features.query;
  let newDoc = [];
  if (req.user.role !== 'root')
    newDoc = doc.filter((element) => {
      if (element.brandName.allowList.includes(req.user.company.id))
        return element;
    });
  else newDoc = doc;
  console.log('test', newDoc);
  res.status(200).render('colors', {
    title: 'Manage Colors',
    newDoc,
    activeMenu: 'Manage Colors',
  });
});
