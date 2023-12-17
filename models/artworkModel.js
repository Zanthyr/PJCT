const mongoose = require('mongoose');

const artworkSchema = new mongoose.Schema(
  {
    artworkId: {
      type: Number,
      unique: true,
      required: [true, 'The artwork must have a identification number'],
    },
    artworkVersion: {
      type: Number,
      default: 1,
      select: false,
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
      required: [true, 'The artwork must have a design image'],
    },
    artworkCreator: {
      type: mongoose.Schema.ObjectId,
      ref: 'Company',
      required: [true, 'The artwork have a creator (company ID)'],
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
    active: {
      type: Boolean,
      default: true,
      select: false,
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

// dont return deactivated accounds when 'find' query
artworkSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

const Artwork = mongoose.model('Artwork', artworkSchema);

module.exports = Artwork;