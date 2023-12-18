const express = require('express');
const companyController = require('./../controllers/companyController');
const imageUploadController = require('./../controllers/imageUploadController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router
  .route('/my') // OK
  .get(companyController.getMyCompany, companyController.getCompany);

router.use(authController.restrictTo('root', 'admin'));

router.patch(
  '/updateMy', // OK
  imageUploadController.uploadImageFile,
  imageUploadController.resizeCompanyPhoto,
  companyController.updateMyCompany,
);

router.use(authController.restrictTo('root'));

router
  .route('/') // only api
  .get(companyController.getAllCompanies)
  .post(companyController.createCompany);

router.route('/:id').patch(companyController.updateCompany); // only api
router.route('/delete/:id').patch(companyController.softDeleteCompany); // only api
router.route('/:id').delete(companyController.deleteCompany); // only api

module.exports = router;
