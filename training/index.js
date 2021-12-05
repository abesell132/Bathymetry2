const Jimp = require("jimp");
const colors = require("../utils");

module.exports = {
  loadBaseImage: function () {
    return new Promise((resolve, reject) => {
      Jimp.read("./training/images/training_base.png")
        .then((img) => resolve(img))
        .catch((e) => reject(e));
    });
  },

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
  getLabeledTrainingPixels: function () {
    return new Promise((resolve, reject) => {
      Jimp.read("./training/images/training_all.png")
        .then((img) => {
          let trainingCoords = {
            land: [],
            water: [],
            depthLine: [],
            depthNumber: [],
          };

          for (let a = 5; a < img.bitmap.width - 5; a++) {
            for (let b = 5; b < img.bitmap.height - 5; b++) {
              let color = Jimp.intToRGBA(img.getPixelColor(a, b));

              if (colors.isRed(color)) {
                trainingCoords.land.push({
                  type: "land",
                  coords: [a, b],
                });
              }

              if (colors.isBlue(color)) {
                trainingCoords.water.push({
                  coords: [a, b],
                  type: "water",
                });
              }

              if (colors.isYellow(color)) {
                trainingCoords.depthLine.push({
                  coords: [a, b],
                  type: "depthLine",
                });
              }

              if (colors.isLightBlue(color)) {
                trainingCoords.depthNumber.push({
                  coords: [a, b],
                  type: "depthNumber",
                });
              }
            }
          }

          resolve(trainingCoords);
        })
        .catch((e) => reject(e));
    });
  },
};
