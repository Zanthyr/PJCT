const express = require('express');
const companyController = require('./../controllers/companyController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router
  .route('/')
  .get(companyController.getAllCompanies)
  .post(companyController.createCompany);

router
  .route('/:id')
  .get(companyController.getCompany)
  .patch(companyController.updateCompany);

router.use(authController.restrictTo('systemAdmin'));

router.route('/delete/:id').patch(companyController.softDeleteCompany);
//router.route('/:id').delete(companyController.deleteCompany);

module.exports = router;
