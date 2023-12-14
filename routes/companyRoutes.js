const express = require('express');
const companyController = require('./../controllers/companyController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router.route('/:id').get(companyController.getCompany);

router.use(authController.restrictTo('systemAdmin', 'companyAdmin'));

router.patch(
  '/updateMy',
  companyController.uploadCompanyPhoto,
  companyController.resizeCompanyPhoto,
  companyController.updateMyCompany,
);

router.use(authController.restrictTo('systemAdmin'));

router
  .route('/')
  .get(companyController.getAllCompanies)
  .post(companyController.createCompany);

router.route('/:id').patch(companyController.updateCompany);
router.route('/delete/:id').patch(companyController.softDeleteCompany);
router.route('/:id').delete(companyController.deleteCompany);

module.exports = router;
