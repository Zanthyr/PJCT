const express = require('express');
const jobController = require('./../controllers/jobController');

const router = express.Router();

router
  .route('/')
  .get(jobController.getAllJobs)
  .post(jobController.createJob);

module.exports = router;
