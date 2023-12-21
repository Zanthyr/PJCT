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
router.get('/artworks', authController.protect, viewsController.getArtworks);

module.exports = router;
