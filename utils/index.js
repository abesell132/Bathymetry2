const Jimp = require("jimp");

module.exports = {
  // Land
  isRed: function (color) {
    let { r, g, b } = color;

    if (r == 255 && g == 0 && b == 0) {
      return true;
    } else {
      return false;
    }
  },

  //   Empty
  isGreen: function (color) {
    let { r, g, b } = color;

    if (r == 0 && g == 255 && b == 0) {
      return true;
    } else {
      return false;
    }
  },

  //   Water
  isBlue: function (color) {
    let { r, g, b } = color;

    if (r == 0 && g == 0 && b == 255) {
      return true;
    } else {
      return false;
    }
  },

  //   Depth Number
  isLightBlue: function (color) {
    let { r, g, b } = color;
    if (r == 0 && g == 255 && b == 255) {
      return true;
    } else {
      return false;
    }
  },

  //   Depth Lines
  isYellow: function (color) {
    let { r, g, b } = color;

    if (r == 255 && g == 255 && b == 0) {
      return true;
    } else {
      return false;
    }
  },
  getRandomNestedArray: function (obj) {
    let depth = 2;

    let shallowLength = Object.keys(obj).length;
    let randomShallowIndex = Object.keys(obj)[Math.floor(Math.random() * shallowLength)];

    let deepLength = obj[randomShallowIndex].length;
    let randomDeepIndex = Math.floor(Math.random() * deepLength);

    return obj[randomShallowIndex][randomDeepIndex];
  },
  findNearestPixels: function (trainingCoords, baseImg) {
    let m2m2 = baseImg.getPixelColor(trainingCoords.coords[0] - 2, trainingCoords.coords[1] - 2);
    let zm2 = baseImg.getPixelColor(trainingCoords.coords[0], trainingCoords.coords[1] - 2);
    let p2m2 = baseImg.getPixelColor(trainingCoords.coords[0] + 2, trainingCoords.coords[1] - 2);
    let m1m1 = baseImg.getPixelColor(trainingCoords.coords[0] - 1, trainingCoords.coords[1] - 1);
    let zm1 = baseImg.getPixelColor(trainingCoords.coords[0], trainingCoords.coords[1] - 1);
    let p1m1 = baseImg.getPixelColor(trainingCoords.coords[0] + 1, trainingCoords.coords[1] - 1);
    let m2z = baseImg.getPixelColor(trainingCoords.coords[0] - 2, trainingCoords.coords[1]);
    let m1z = baseImg.getPixelColor(trainingCoords.coords[0] - 1, trainingCoords.coords[1]);
    let zz = baseImg.getPixelColor(trainingCoords.coords[0], trainingCoords.coords[1]);
    let p1z = baseImg.getPixelColor(trainingCoords.coords[0] + 1, trainingCoords.coords[1]);
    let p2z = baseImg.getPixelColor(trainingCoords.coords[0] + 2, trainingCoords.coords[1]);
    let m1p1 = baseImg.getPixelColor(trainingCoords.coords[0] - 1, trainingCoords.coords[1] + 1);
    let zp1 = baseImg.getPixelColor(trainingCoords.coords[0], trainingCoords.coords[1] + 1);
    let p1p1 = baseImg.getPixelColor(trainingCoords.coords[0] + 1, trainingCoords.coords[1] + 1);
    let m2p2 = baseImg.getPixelColor(trainingCoords.coords[0] - 2, trainingCoords.coords[1] + 2);
    let zp2 = baseImg.getPixelColor(trainingCoords.coords[0], trainingCoords.coords[1] + 2);
    let p2p2 = baseImg.getPixelColor(trainingCoords.coords[0] + 2, trainingCoords.coords[1] + 2);

    let m2m2Color = Jimp.intToRGBA(m2m2);
    let zm2Color = Jimp.intToRGBA(zm2);
    let p2m2Color = Jimp.intToRGBA(p2m2);
    let m1m1Color = Jimp.intToRGBA(m1m1);
    let zm1Color = Jimp.intToRGBA(zm1);
    let p1m1Color = Jimp.intToRGBA(p1m1);
    let m2zColor = Jimp.intToRGBA(m2z);
    let m1zColor = Jimp.intToRGBA(m1z);
    let zzColor = Jimp.intToRGBA(zz);
    let p1zColor = Jimp.intToRGBA(p1z);
    let p2zColor = Jimp.intToRGBA(p2z);
    let m1p1Color = Jimp.intToRGBA(m1p1);
    let zp1Color = Jimp.intToRGBA(zp1);
    let p1p1Color = Jimp.intToRGBA(p1p1);
    let m2p2Color = Jimp.intToRGBA(m2p2);
    let zp2Color = Jimp.intToRGBA(zp2);
    let p2p2Color = Jimp.intToRGBA(p2p2);

    let neighborPixels = [];
    neighborPixels.push(m2m2Color.r / 255);
    neighborPixels.push(m2m2Color.g / 255);
    neighborPixels.push(m2m2Color.b / 255);
    neighborPixels.push(zm2Color.r / 255);
    neighborPixels.push(zm2Color.g / 255);
    neighborPixels.push(zm2Color.b / 255);
    neighborPixels.push(p2m2Color.r / 255);
    neighborPixels.push(p2m2Color.g / 255);
    neighborPixels.push(p2m2Color.b / 255);
    neighborPixels.push(m1m1Color.r / 255);
    neighborPixels.push(m1m1Color.g / 255);
    neighborPixels.push(m1m1Color.b / 255);
    neighborPixels.push(zm1Color.r / 255);
    neighborPixels.push(zm1Color.g / 255);
    neighborPixels.push(zm1Color.b / 255);
    neighborPixels.push(p1m1Color.r / 255);
    neighborPixels.push(p1m1Color.g / 255);
    neighborPixels.push(p1m1Color.b / 255);
    neighborPixels.push(m2zColor.r / 255);
    neighborPixels.push(m2zColor.g / 255);
    neighborPixels.push(m2zColor.b / 255);
    neighborPixels.push(m1zColor.r / 255);
    neighborPixels.push(m1zColor.g / 255);
    neighborPixels.push(m1zColor.b / 255);
    neighborPixels.push(zzColor.r / 255);
    neighborPixels.push(zzColor.g / 255);
    neighborPixels.push(zzColor.b / 255);
    neighborPixels.push(p1zColor.r / 255);
    neighborPixels.push(p1zColor.g / 255);
    neighborPixels.push(p1zColor.b / 255);
    neighborPixels.push(p2zColor.r / 255);
    neighborPixels.push(p2zColor.g / 255);
    neighborPixels.push(p2zColor.b / 255);
    neighborPixels.push(m1p1Color.r / 255);
    neighborPixels.push(m1p1Color.g / 255);
    neighborPixels.push(m1p1Color.b / 255);
    neighborPixels.push(zp1Color.r / 255);
    neighborPixels.push(zp1Color.g / 255);
    neighborPixels.push(zp1Color.b / 255);
    neighborPixels.push(p1p1Color.r / 255);
    neighborPixels.push(p1p1Color.g / 255);
    neighborPixels.push(p1p1Color.b / 255);
    neighborPixels.push(m2p2Color.r / 255);
    neighborPixels.push(m2p2Color.g / 255);
    neighborPixels.push(m2p2Color.b / 255);
    neighborPixels.push(zp2Color.r / 255);
    neighborPixels.push(zp2Color.g / 255);
    neighborPixels.push(zp2Color.b / 255);
    neighborPixels.push(p2p2Color.r / 255);
    neighborPixels.push(p2p2Color.g / 255);
    neighborPixels.push(p2p2Color.b / 255);
    return neighborPixels;
  },
};
