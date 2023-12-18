const express = require('express');
const viewsController = require('../controllers/viewController');
const authController = require('../controllers/authController');

const router = express.Router();

router.get('/pwsReset', viewsController.pwdReset);
router.get('/', authController.isLoggedIn, viewsController.getHome);
router.get('/login', authController.isLoggedIn, viewsController.getLoginForm);
router.get('/me', authController.protect, viewsController.getAccount);
router.get('/my', authController.protect, viewsController.getCompany);
router.get('/users', authController.protect, viewsController.getUsers);
router.get('/brands', authController.protect, viewsController.getBrands);
router.get('/colors', authController.protect, viewsController.getColors);

module.exports = router;
