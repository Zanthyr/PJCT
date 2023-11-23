const catchAsync = require('../utils/catchAsync');
const Job = require('./../models/jobModel');

exports.getAllJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find();
    res.status(201).json({
      status: 'succes',
      results: jobs.length,
      data: { jobs }
    });
  } catch (err) {
    console.log(err);
  }
};

exports.createJob = async (req, res, next) => {
  try {
    const newJob = await Job.create(req.body);
    res.status(201).json({
      status: 'succes',
      data: { job: newJob }
    });
  } catch (err) {
    console.log(err);
  }
};

// exports.findJob = async (req, res, next) => {
//   try {
//     const job = await Job.findById(req.params.id);
//     if (!job) {
//       res.status(400).json({
//         status: 'fail',
//         message: 'no job found'
//       });
//       return;
//     }
//     res.status(201).json({
//       status: 'succes',
//       data: { job }
//     });
//   } catch (err) {
//     console.log(err);
//   }
// };

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

exports.updateJob = async (req, res, next) => {
  try {
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
  } catch (err) {
    console.log(err);
  }
};

exports.deleteJob = async (req, res, next) => {
  try {
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
  } catch (err) {
    console.log(err);
  }
};
