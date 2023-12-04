const catchAsync = require('../utils/catchAsync');
const Job = require('./../models/jobModel');

exports.getAllJobs = catchAsync(async (req, res, next) => {
  const jobs = await Job.find();
  res.status(201).json({
    status: 'succes',
    results: jobs.length,
    data: { jobs }
  });
});

exports.createJob = catchAsync(async (req, res, next) => {
  const newJob = await Job.create(req.body);
  res.status(201).json({
    status: 'succes',
    data: { job: newJob }
  });
});

exports.findJob = catchAsync(async (req, res, next) => {
  const job = await Job.findById(req.params.id);
  if (!job) {
    res.status(400).json({
      status: 'fail',
      message: 'no job found'
    });
    return;
  }
  res.status(201).json({
    status: 'succes',
    data: { job }
  });
});

exports.updateJob = catchAsync(async (req, res, next) => {
  const job = await Job.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!job) {
    res.status(400).json({
      status: 'fail',
      message: 'no job found'
    });
    return;
  }
  res.status(204).json({
    status: 'succes',
    data: { job }
  });
});

exports.deleteJob = catchAsync(async (req, res, next) => {
  const job = await Job.findByIdAndDelete(req.params.id);
  if (!job) {
    res.status(400).json({
      status: 'fail',
      message: 'no job found'
    });
    return;
  }
  res.status(204).json({
    status: 'succes',
    data: null
  });
});
