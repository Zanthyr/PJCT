const Job = require('./../models/jobModel');

exports.getAllJobs = (req, res, next) => {
  res.send('Get all Jobs route');
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
