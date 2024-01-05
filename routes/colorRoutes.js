const express = require('express');
const colorController = require('./../controllers/colorController');
const authController = require('./../controllers/authController');
const multiParser = require('./../utils/multiParser');

const router = express.Router();

router.use(authController.protect);

router.route('/').get(colorController.getAllColors);

router.route('/:id').get(colorController.getColor);

router.use(authController.restrictTo('root', 'admin'));

router
  .route('/createMy')
  .post(multiParser.uploadFields, colorController.createMyColor);

router
  .route('/:id')
  .patch(multiParser.uploadFields, colorController.updateColor);
router.route('/delete/:id').patch(colorController.softDeleteColor);

router.use(authController.restrictTo('root'));

router.route('/:id').delete(colorController.deleteColor);

module.exports = router;
