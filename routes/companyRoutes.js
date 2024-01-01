const express = require('express');
const companyController = require('./../controllers/companyController');
const multiParser = require('./../utils/multiParser');
const authController = require('./../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router
  .route('/my') // OK
  .get(companyController.getMyCompany, companyController.getCompany);

router.use(authController.restrictTo('root', 'admin'));

router.patch(
  '/updateMy', // OK
  multiParser.uploadImageFile,
  multiParser.resizeCompanyPhoto,
  companyController.updateMyCompany,
);

router.route('/delete/:id').patch(companyController.softDeleteCompany); // only api

router.use(authController.restrictTo('root'));

router
  .route('/') // only api
  .get(companyController.getAllCompanies)
  .post(multiParser.uploadFields, companyController.createCompany);
router.route('/:id').patch(companyController.updateCompany); // only api
router.route('/:id').delete(companyController.deleteCompany); // only api

module.exports = router;
