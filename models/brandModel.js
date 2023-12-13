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
    brandOwner: {
      type: mongoose.Schema.ObjectId,
      ref: 'Company',
    },
    brandManagers: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Managers',
      },
    ],
    brandSuppliers: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Suppliers',
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

// dont return deactivated accounds when 'find' query
brandSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

brandSchema.post(/^find/, function (docs, next) {
  if (docs.length === undefined) newDoc = [docs];
  else newDoc = docs;
  newDoc.forEach((element) => {
    let array = element.brandManagers.concat(element.brandSuppliers);
    newArr = array.map((element) => {
      str = JSON.stringify(element);
      newStr = str.substring(1, str.length - 1);
      return newStr;
    });
    const allowList = [element.brandOwner.id].concat(newArr);
    element.allowList = allowList;
    return element;
  });
  docs = newDoc;
  next();
});

const Brand = mongoose.model('Brand', brandSchema);

module.exports = Brand;
