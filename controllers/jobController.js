const catchAsync = require('../utils/catchAsync');
const Job = require('./../models/jobModel');
const factory = require('./handlerFactory');
const utils = require('../utils/utils');

exports.getAllJobs = factory.getAll(Job);
exports.getJob = factory.getOne(Job);
exports.createJob = factory.createOne(Job);
exports.updateJob = factory.updateOne(Job);
exports.deleteJob = factory.deleteOne(Job);

exports.addJob = catchAsync(async (req, res, next) => {
  const filteredBody = utils.filterObj(
    req.body,
    'artworkId',
    'jobId',
    'printerName',
    'printerEmail',
  );
  filteredBody.jobCreator = req.user.company.id;

  const job = await Job.create(filteredBody);

  res.status(201).json({
    status: 'success',
    data: {
      data: job,
    },
  });
});
