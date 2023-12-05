const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    jobkId: {
      type: Number,
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
    printer: {
      type: mongoose.Schema.ObjectId,
      ref: 'Company',
      required: [true, 'A job must have a Printer'],
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
