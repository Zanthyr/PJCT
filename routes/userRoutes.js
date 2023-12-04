const express = require('express');
const userController = require('./../controllers/userController');

const router = express.Router();

router
  .route('/')
  .get(userController.getAllJobs)
  .post(userController.createJob);

router
  .route('/:id')
  .get(userController.findJob)
  .patch(userController.updateJob)
  .delete(userController.deleteJob);

module.exports = router;
