const mongoose = require('mongoose');

const artworkSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A job must have a name'],
    },
    description: {
      type: String,
    },
    image: {
      type: String,
      required: [true, 'A tour must have a design image'],
    },
    creator: {
      type: mongoose.Schema.ObjectId,
      ref: 'Company',
      required: [true, 'A job must have a creator (company ID)'],
    },
    sharedwithComapnies: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Company',
      },
    ],
    colors: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Color',
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } },
);
const Artwork = mongoose.model('Artwork', artworkSchema);

module.exports = Artwork;
