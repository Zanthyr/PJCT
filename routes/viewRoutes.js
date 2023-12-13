const express = require('express');
const viewsController = require('../controllers/viewController');
const authController = require('../controllers/authController');

const router = express.Router();

router.get('/', viewsController.getLogin); //authController.isLoggedIn

module.exports = router;
