const express = require('express');
const colorController = require('./../controllers/colorController');

const router = express.Router();

router
  .route('/')
  .get(colorController.getAllColors)
  .post(colorController.createColor);

router
  .route('/:id')
  .get(colorController.getColor)
  .patch(colorController.updateColor)
  .delete(colorController.deleteColor);

module.exports = router;
