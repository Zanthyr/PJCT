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
        ref: 'Company',
      },
    ],
    brandSuppliers: [
      {
        type: mongoose.Schema.ObjectId,
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
  if (docs.length === undefined) newDoc = [docs];
  else newDoc = docs;
  //console.log('here', docs[0].brandSuppliers);
  newDoc.forEach((element) => {
    const newBrandManagers = element.brandManagers.map((item) => item.id);
    const newBrandSuppliers = element.brandSuppliers.map((item) => item.id);
    let array = newBrandManagers.concat(newBrandSuppliers);
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
