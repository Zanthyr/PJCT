const express = require('express');
const colorController = require('./../controllers/colorController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router.route('/').get(colorController.getAllColors);

router.route('/:id').get(colorController.getColor);

router.use(authController.restrictTo('root', 'admin'));

router.route('/').post(colorController.createColor);

router.route('/:id').patch(colorController.updateColor);

router.use(authController.restrictTo('root'));

router.route('/delete/:id').patch(colorController.softDeleteColor);
router.route('/:id').delete(colorController.deleteColor);

module.exports = router;
