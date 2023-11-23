const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    jobName: {
      type: String,
      required: [true, 'A job must have a name']
    },
    jobDescription: {
      type: String
    },
    jobCreatedAt: {
      type: Date,
      default: Date.now()
    }
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
const Job = mongoose.model('Job', jobSchema);

module.exports = Job;
