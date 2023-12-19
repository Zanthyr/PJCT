const express = require('express');
const brandController = require('../controllers/brandController.js');
const authController = require('../controllers/authController.js');
const uploadController = require('./../controllers/uploadController');

const router = express.Router();

router.use(authController.protect);

router.route('/My').get(brandController.getAllMyBrands); // dont need
router.route('/My/:id').get(brandController.getMyBrand); // dont need

router.route('/createMy').post(
  //ok
  authController.restrictTo('admin', 'root'),
  authController.restrictToCompanyType('BrandOwner', 'System'),
  uploadController.uploadImageFile,
  uploadController.resizeBrandLogo,
  brandController.createMyBrand,
);

router
  .route('/updateMy/:id')
  .patch(authController.restrictTo('admin'), brandController.updateMyBrand); //TODO

router
  .route('/delete/:id')
  .patch(authController.restrictTo('admin'), brandController.softDeleteBrand); //TODO

router.use(authController.restrictTo('root'));

router
  .route('/') // only API
  .get(brandController.getAllBrands)
  .post(brandController.createBrand);

router
  .route('/:id') // only API
  .get(brandController.getBrand)
  .patch(brandController.updateBrand);

router.route('/delete/:id').patch(brandController.softDeleteBrand); // only API

router.route('/:id').delete(brandController.deleteBrand); // only API

module.exports = router;
