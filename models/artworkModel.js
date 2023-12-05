const mongoose = require('mongoose');

const artworkSchema = new mongoose.Schema(
  {
    artworkId: {
      type: Number,
      required: [true, 'The artwork must have a identification number'],
    },
    artworkName: {
      type: String,
      required: [true, 'The artwork must have a name'],
    },
    artworkDescription: {
      type: String,
    },
    artworkImage: {
      type: String,
      required: [true, 'A tour must have a design image'],
    },
    artworkCreator: {
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
    artworkColors: [
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

artworkSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'artworkCreator',
    select: 'companyName',
  }).populate({
    path: 'artworkColors',
    select: 'colorName',
  });
  next();
});

const Artwork = mongoose.model('Artwork', artworkSchema);

module.exports = Artwork;
