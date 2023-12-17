const express = require('express');
const artworkController = require('../controllers/artworkController.js');
const authController = require('./../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router
  .route('/')
  .get(artworkController.getAllArtworks)
  .post(authController.isArtworkCreator(), artworkController.createArtwork);

router
  .route('/:id')
  .get(artworkController.getArtwork)
  .patch(artworkController.updateArtwork);

router.use(authController.restrictTo('root'));

router.route('/delete/:id').patch(artworkController.softDeleteArtwork);
//router.route('/:id').delete(artworkController.deleteArtwork);

module.exports = router;