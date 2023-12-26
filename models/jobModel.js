const mongoose = require('mongoose');
const validator = require('validator');

const jobSchema = new mongoose.Schema(
  {
    jobId: {
      type: Number,
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

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;
