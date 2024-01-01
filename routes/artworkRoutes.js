const express = require('express');
const artworkController = require('../controllers/artworkController.js');
const authController = require('./../controllers/authController');
const multiparser = require('./../utils/multiParser.js');

const router = express.Router();

router.use(authController.protect);

router
  .route('/createArtwork')
  .post(
    authController.isArtworkCreator(),
    multiparser.uploadFields,
    artworkController.createArtwork,
  );

router
  .route('/addImage')
  .post(
    authController.isArtworkCreator(),
    multiparser.uploadFile,
    multiparser.resizeArtworkImage,
    artworkController.addImage,
  );

router
  .route('/addColors')
  .post(
    authController.isArtworkCreator(),
    multiparser.uploadFields,
    artworkController.addColors,
  );

router.route('/delete/:id').patch(artworkController.softDeleteArtwork);

router.use(authController.restrictTo('root'));

router
  .route('/')
  .get(artworkController.getAllArtworks)
  .post(authController.isArtworkCreator(), artworkController.apiCreateArtwork);

router
  .route('/:id')
  .get(artworkController.getArtwork)
  .patch(artworkController.updateArtwork);

router.route('/:id').delete(artworkController.deleteArtwork);

module.exports = router;
