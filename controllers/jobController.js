const catchAsync = require('../utils/catchAsync');
const Job = require('./../models/jobModel');
const factory = require('./handlerFactory');
const utils = require('../utils/utils');
const AppError = require('../utils/appError');
const Email = require('../utils/email');

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

  if (!job) {
    return next(new AppError('Unable to create job', 404));
  }

  const submitToken = job.createJobSubmitToken();
  await job.save({ validateBeforeSave: false });
  const user = {
    userName: filteredBody.printerName,
    email: filteredBody.printerEmail,
  };

  try {
    const submitURL = `${req.protocol}://${req.get(
      'host',
    )}/submitJob/${submitToken}`;
    await new Email(user, submitURL).sendJobSubmit();

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!',
    });
  } catch (err) {
    job.submitJobToken = undefined;
    job.submitJobExpires = undefined;
    await job.save({ validateBeforeSave: false });

    return next(
      new AppError('There was an error sending the email. Try again later!'),
      500,
    );
  }

  res.status(201).json({
    status: 'success',
    data: {
      data: job,
    },
  });
});

exports.submitJob = catchAsync(async (req, res, next) => {
  console.log('test', req.body);

  res.status(201).json({
    status: 'success',
    data: {
      data: job,
    },
  });
});
