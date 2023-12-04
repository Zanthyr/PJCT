const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    artworkId: {
      type: mongoose.Schema.ObjectId,
      ref: 'Artwork',
      required: [true, 'Job must have an Artwork'],
    },
    jobCreator: {
      type: mongoose.Schema.ObjectId,
      ref: 'Company',
      required: [true, 'A job must have a creator (company ID)'],
    },
    printer: {
      type: mongoose.Schema.ObjectId,
      ref: 'Company',
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } },
);
const Job = mongoose.model('Job', jobSchema);

module.exports = Job;
