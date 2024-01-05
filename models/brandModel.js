const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema(
  {
    // gekoppeld aan company dmv Brandowner ID
    brandName: {
      type: String,
      unique: true,
      required: [true, 'A brand must have a name'],
    },
    productGroup: {
      type: String,
      default: 'not aplicable',
    },
    brandLogo: {
      type: String,
      default: 'default.jpg',
    },
    brandOwner: {
      type: mongoose.Schema.ObjectId,
      ref: 'Company',
    },
    brandManagers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
      },
    ],
    brandSuppliers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
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

brandSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'brandOwner',
    select: 'companyName',
  });
  next();
});

brandSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'brandManagers',
    select: 'companyName',
  });
  next();
});

brandSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'brandSuppliers',
    select: 'companyName',
  });
  next();
});

// dont return deactivated accounds when 'find' query
brandSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

brandSchema.post(/^find/, function (docs, next) {
  if (!Array.isArray(docs)) {
    docs = [docs];
  }
  docs.forEach((element) => {
    const extractIds = (items) =>
      items.map((item) => JSON.stringify(item.id).slice(1, -1));
    const brandManagers = extractIds(element.brandManagers);
    const managerList = [element.brandOwner.id, ...brandManagers];
    element.managerList = managerList;
    const brandSuppliers = extractIds(element.brandSuppliers);
    const allowList = [...managerList, ...brandSuppliers];
    element.allowList = allowList;
  });
  next();
});

const Brand = mongoose.model('Brand', brandSchema);

module.exports = Brand;
