const mongoose = require('mongoose');
const validator = require('validator');
const crypto = require('crypto');

const jobSchema = new mongoose.Schema(
  {
    jobId: {
      type: String,
      unique: true,
      required: [true, 'Job must have an number'],
    },
    artworkId: {
      type: mongoose.Schema.ObjectId,
      ref: 'Artwork',
      required: [true, 'Job must have an Artwork'],
    },
    jobCreator: {
      type: mongoose.Schema.ObjectId,
      ref: 'Company',
      required: [true, 'A job must have a creator'],
    },
    printerName: {
      type: String,
      required: [true, 'A job must have a Priter'],
    },
    printerEmail: {
      type: String,
      required: [true, 'A printer must have a Email adress'],
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email'],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    submitJobToken: String,
    submitJobExpires: Date,
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } },
);

jobSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'artworkId',
    select: '-__v -sharedwithComapnies -_id',
  });
  next();
});

jobSchema.methods.createJobSubmitToken = function (numDays = 30) {
  const submitToken = crypto.randomBytes(8).toString('hex');

  this.submitJobToken = crypto
    .createHash('sha256')
    .update(submitToken)
    .digest('hex');

  this.submitJobExpires = Date.now() + numDays * 24 * 60 * 60 * 1000;
  return submitToken;
};

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;
