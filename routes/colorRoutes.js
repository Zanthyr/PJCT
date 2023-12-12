const express = require('express');
const colorController = require('./../controllers/colorController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router
  .route('/')
  .get(colorController.getAllColors)
  .post(colorController.createColor);

router
  .route('/:id')
  .get(colorController.getColor)
  .patch(colorController.updateColor);

router.use(authController.restrictTo('systemAdmin'));

router.route('/:id').delete(colorController.deleteColor);

module.exports = router;
