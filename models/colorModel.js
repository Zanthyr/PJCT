const mongoose = require('mongoose');

const colorSchema = new mongoose.Schema(
  {
    colorName: {
      type: String,
      required: [true, 'A job must have a name']
    },
    colorCreatedAt: {
      type: Date,
      default: Date.now()
    }
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
const Color = mongoose.model('Job', colorSchema);

module.exports = Color;
