const mongoose = require('mongoose');

const artworkSchema = new mongoose.Schema(
  {
    artworkId: {
      type: String,
      unique: true,
      required: [true, 'The artwork must have clear identification'],
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
    artworkForBrand: {
      type: mongoose.Schema.ObjectId,
      ref: 'Brand',
    },
    brandOwner: {
      type: mongoose.Schema.ObjectId,
      ref: 'Company',
    },
    createdByCompany: {
      type: mongoose.Schema.ObjectId,
      ref: 'Company',
    },
    artworkImage: {
      type: String,
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
        coords: [Number],
        color: { type: mongoose.Schema.ObjectId, ref: 'Color' },
      },
    ],
    artworkState: {
      type: Number,
      default: 1,
      select: false,
    },
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
  })
    .populate({
      path: 'artworkColors',
      select: 'colorName',
    })
    .populate({
      path: 'artworkForBrand',
      select: 'brandName',
    });
  next();
});

// dont return deactivated accounts when 'find' query
artworkSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

const Artwork = mongoose.model('Artwork', artworkSchema);

module.exports = Artwork;