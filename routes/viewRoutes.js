const express = require('express');
const viewsController = require('../controllers/viewController');
const authController = require('../controllers/authController');

const router = express.Router();

router.get('/requestReset', viewsController.requestReset);
router.get('/resetPassword/:token', viewsController.resetPassword);
router.get('/', authController.isLoggedIn, viewsController.getHome);
router.get('/login', authController.isLoggedIn, viewsController.getLoginForm);
router.get('/me', authController.protect, viewsController.getAccount);
router.get('/my', authController.protect, viewsController.getCompany);
router.get('/users', authController.protect, viewsController.getUsers);
router.get('/brands', authController.protect, viewsController.getBrands);
router.get('/colors', authController.protect, viewsController.getColors);
router.get('/companies', authController.protect, viewsController.getCompanies);
router.get(
  '/addArtworkData',
  authController.protect,
  viewsController.addArtworkData,
);
router.get(
  '/addArtworkImage/:id',
  authController.protect,
  viewsController.addArtworkImage,
);
router.get(
  '/addArtworkColors/:id',
  authController.protect,
  viewsController.addArtworkColors,
);
router.get('/addJob/:id', authController.protect, viewsController.addJob);
router.get('/submitJob/:token', viewsController.submitJob);
router.get(
  '/submitJobInt/:token',
  authController.protect,
  viewsController.submitJob,
);

module.exports = router;
