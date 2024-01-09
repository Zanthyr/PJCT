exports.filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.labToHex = (L, a, b) => {
  // Convert LAB to RGB
  function labToRgb(L, a, b) {
    var Y = (L + 16) / 116;
    var X = a / 500 + Y;
    var Z = Y - b / 200;

    Y = Y ** 3 > 0.008856 ? Y ** 3 : (Y - 16 / 116) / 7.787;
    X = X ** 3 > 0.008856 ? X ** 3 : (X - 16 / 116) / 7.787;
    Z = Z ** 3 > 0.008856 ? Z ** 3 : (Z - 16 / 116) / 7.787;

    var X_D65 = X * 0.95047;
    var Y_D65 = Y;
    var Z_D65 = Z * 1.08883;

    var R = X_D65 * 3.2406 + Y_D65 * -1.5372 + Z_D65 * -0.4986;
    var G = X_D65 * -0.9689 + Y_D65 * 1.8758 + Z_D65 * 0.0415;
    var B = X_D65 * 0.0557 + Y_D65 * -0.204 + Z_D65 * 1.057;

    R = R > 0.0031308 ? 1.055 * R ** (1 / 2.4) - 0.055 : 12.92 * R;
    G = G > 0.0031308 ? 1.055 * G ** (1 / 2.4) - 0.055 : 12.92 * G;
    B = B > 0.0031308 ? 1.055 * B ** (1 / 2.4) - 0.055 : 12.92 * B;

    R = Math.max(0, Math.min(1, R));
    G = Math.max(0, Math.min(1, G));
    B = Math.max(0, Math.min(1, B));

    R = Math.round(R * 255);
    G = Math.round(G * 255);
    B = Math.round(B * 255);

    return [R, G, B];
  }

  // Convert RGB to HEX
  function rgbToHex(rgb) {
    return (
      '#' +
      rgb
        .map((component) => {
          var hex = component.toString(16);
          return hex.length === 1 ? '0' + hex : hex;
        })
        .join('')
    );
  }

  var rgbValues = labToRgb(L, a, b);
  return rgbToHex(rgbValues);
};
