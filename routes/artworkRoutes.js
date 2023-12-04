const express = require('express');
const brandArtwork = require('../controllers/artworkController.js');

const router = express.Router();

router
  .route('/')
  .get(brandArtwork.getAllArtworks)
  .post(brandArtwork.createArtwork);

router
  .route('/:id')
  .get(brandArtwork.getArtwork)
  .patch(brandArtwork.updateArtwork)
  .delete(brandArtwork.deleteArtwork);

module.exports = router;
