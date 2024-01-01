const express = require('express');
const jobController = require('./../controllers/jobController');
const authController = require('./../controllers/authController');
const multiparser = require('./../utils/multiParser.js');

const router = express.Router();

router
  .route('/submitJob')
  .post(multiparser.uploadFields, jobController.submitJob);

router.use(authController.protect);

router
  .route('/addJob')
  .post(
    authController.isJobCreator(),
    multiparser.uploadFields,
    jobController.addJob,
  );

router.route('/:id').delete(jobController.deleteJob);

router.use(authController.restrictTo('root'));

router.route('/').get(jobController.getAllJobs).post(jobController.createJob);
router.route('/:id').get(jobController.getJob).patch(jobController.updateJob);

module.exports = router;
