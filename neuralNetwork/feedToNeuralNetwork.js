const Jimp = require("jimp");
const path = require("path");

module.exports = feedToNeuralNetwork = async (lakeImages) => {
  let { imageDir, totalCol, totalRow } = lakeImages;

  let predictions = [];

  //   for (let imgY = 1; imgY < totalRow; imgY++) {
  //     for (let imgX = 1; imgX < totalCol; imgX++) {
  let imgY = 1;
  let imgX = 1;
  let currentImgPath = imageDir + "/lake" + imgY + "-" + imgX + ".png";

  let startPixelX = 0;
  let startPixelY = 0;
  let endPixelX = 1919;
  let endPixelY = 936;

  if (imgX == 1) startPixelX = 3;
  if (imgX == totalCol) endPixelX = 1916;
  if (imgY == 1) startPixelY = 3;
  if (imgY == totalRow) endPixelY = 933;

  let nearbyImages = [
    [null, null, null],
    [null, currentImgPath, null],
    [null, null, null],
  ];

  if (imgX == 1 && imgY == 1) {
    nearbyImages[1][2] = imageDir + "/lake" + imgY + "-" + (imgX + 1) + ".png";
    nearbyImages[2][1] = imageDir + "/lake" + (imgY + 1) + "-" + imgX + ".png";
    nearbyImages[2][2] = imageDir + "/lake" + (imgY + 1) + "-" + (imgX + 1) + ".png";
  } else if (imgX == totalCol && imgY == 1) {
    nearbyImages[1][0] = imageDir + "/lake" + imgY + "-" + (imgX - 1) + ".png";
    nearbyImages[2][1] = imageDir + "/lake" + (imgY + 1) + "-" + imgX + ".png";
    nearbyImages[2][0] = imageDir + "/lake" + (imgY + 1) + "-" + (imgX - 1) + ".png";
  } else if (imgX == 1 && imgY == totalRow) {
    nearbyImages[0][1] = imageDir + "/lake" + (imgY - 1) + "-" + imgX + ".png";
    nearbyImages[0][2] = imageDir + "/lake" + (imgY - 1) + "-" + (imgX + 1) + ".png";
    nearbyImages[1][2] = imageDir + "/lake" + imgY + "-" + (imgX + 1) + ".png";
  } else if (imgX == totalCol && imgY == totalRow) {
    nearbyImages[0][1] = imageDir + "/lake" + (imgY - 1) + "-" + imgX + ".png";
    nearbyImages[0][0] = imageDir + "/lake" + (imgY - 1) + "-" + (imgX - 1) + ".png";
    nearbyImages[1][0] = imageDir + "/lake" + imgY + "-" + (imgX - 1) + ".png";
  } else if (imgY == 1) {
    nearbyImages[1][0] = imageDir + "/lake" + imgY + "-" + (imgX - 1) + ".png";
    nearbyImages[1][2] = imageDir + "/lake" + imgY + "-" + (imgX + 1) + ".png";
    nearbyImages[2][1] = imageDir + "/lake" + (imgY + 1) + "-" + imgX + ".png";
    nearbyImages[2][0] = imageDir + "/lake" + (imgY + 1) + "-" + (imgX - 1) + ".png";
    nearbyImages[2][2] = imageDir + "/lake" + (imgY + 1) + "-" + (imgX + 1) + ".png";
  } else if (imgX == 1) {
    nearbyImages[0][1] = imageDir + "/lake" + (imgY - 1) + "-" + imgX + ".png";
    nearbyImages[0][2] = imageDir + "/lake" + (imgY - 1) + "-" + (imgX + 1) + ".png";
    nearbyImages[1][2] = imageDir + "/lake" + imgY + "-" + (imgX + 1) + ".png";
    nearbyImages[2][1] = imageDir + "/lake" + (imgY + 1) + "-" + imgX + ".png";
    nearbyImages[2][2] = imageDir + "/lake" + (imgY + 1) + "-" + (imgX + 1) + ".png";
  } else if (imgX == totalCol) {
    nearbyImages[0][1] = imageDir + "/lake" + (imgY - 1) + "-" + imgX + ".png";
    nearbyImages[0][0] = imageDir + "/lake" + (imgY - 1) + "-" + (imgX - 1) + ".png";
    nearbyImages[1][0] = imageDir + "/lake" + imgY + "-" + (imgX - 1) + ".png";
    nearbyImages[2][1] = imageDir + "/lake" + (imgY + 1) + "-" + imgX + ".png";
    nearbyImages[2][0] = imageDir + "/lake" + (imgY + 1) + "-" + (imgX - 1) + ".png";
  } else if (imgY == totalRow) {
    nearbyImages[0][0] = imageDir + "/lake" + (imgY - 1) + "-" + (imgX - 1) + ".png";
    nearbyImages[0][1] = imageDir + "/lake" + (imgY - 1) + "-" + imgX + ".png";
    nearbyImages[0][2] = imageDir + "/lake" + (imgY - 1) + "-" + (imgX + 1) + ".png";
    nearbyImages[1][0] = imageDir + "/lake" + imgY + "-" + (imgX - 1) + ".png";
    nearbyImages[1][2] = imageDir + "/lake" + imgY + "-" + (imgX + 1) + ".png";
  } else {
    nearbyImages[0][0] = imageDir + "/lake" + (imgY - 1) + "-" + (imgX - 1) + ".png";
    nearbyImages[0][1] = imageDir + "/lake" + (imgY - 1) + "-" + imgX + ".png";
    nearbyImages[0][2] = imageDir + "/lake" + (imgY - 1) + "-" + (imgX + 1) + ".png";
    nearbyImages[1][0] = imageDir + "/lake" + imgY + "-" + (imgX - 1) + ".png";
    nearbyImages[1][2] = imageDir + "/lake" + imgY + "-" + (imgX + 1) + ".png";
    nearbyImages[2][0] = imageDir + "/lake" + (imgY + 1) + "-" + (imgX - 1) + ".png";
    nearbyImages[2][1] = imageDir + "/lake" + (imgY + 1) + "-" + imgX + ".png";
    nearbyImages[2][2] = imageDir + "/lake" + (imgY + 1) + "-" + (imgX + 1) + ".png";
  }

  await console.time("load images");
  nearbyImages = await loadNearbyImages(nearbyImages);
  await console.timeEnd("load images");

  for (let a = startPixelY; a < endPixelY; a++) {
    for (let b = startPixelX; b < endPixelX; b++) {
      let x = await b;
      let y = await a;

      let m2m2 = await [x - 2, y - 2]; // [0,0] -> [-2,-2]
      let zm2 = await [x, y - 2]; // [2,1]-> [0,-1]
      let p2m2 = await [x + 2, y - 2]; // [ 1919, 1] -> [1921,-1] -> [1, 0]
      let m1m1 = await [x - 1, y - 1];
      let zm1 = await [x, y - 1];
      let p1m1 = await [x + 1, y - 1];
      let m2z = await [x - 2, y];
      let m1z = await [x - 1, y];
      let zz = await [x, y];
      let p1z = await [x + 1, y];
      let p2z = await [x + 2, y];
      let m1p1 = await [x - 1, y + 1];
      let zp1 = await [x, y + 1];
      let p1p1 = await [x + 1, y + 1];
      let m2p2 = await [x - 2, y + 2];
      let zp2 = await [x, y + 2];
      let p2p2 = await [x + 2, y + 2];
      let m2m2Color,
        zm2Color,
        p2m2Color,
        m1m1Color,
        zm1Color,
        p1m1Color,
        m2zColor,
        m1zColor,
        zzColor,
        p1zColor,
        p2zColor,
        m1p1Color,
        zp1Color,
        p1p1Color,
        m2p2Color,
        zp2Color,
        p2p2Color;

      if (m2m2[0] < 0 && m2m2[1] < 0) {
        m2m2Color = await Jimp.intToRGBA(nearbyImages[0][0].getPixelColor(1920 + m2m2[0], 937 + m2m2[1]));
      } else if (m2m2[0] < 0) {
        m2m2Color = await Jimp.intToRGBA(nearbyImages[1][0].getPixelColor(1920 + m2m2[0], m2m2[1]));
      } else if (m2m2[1] < 0) {
        m2m2Color = await Jimp.intToRGBA(nearbyImages[0][1].getPixelColor(m2m2[0], 937 + m2m2[1]));
      } else {
        m2m2Color = await Jimp.intToRGBA(nearbyImages[1][1].getPixelColor(m2m2[0], m2m2[1]));
      }

      if (zm2[1] < 0) {
        zm2Color = await Jimp.intToRGBA(nearbyImages[0][1].getPixelColor(zm2[0], 937 + zm2[1]));
      } else {
        zm2Color = await Jimp.intToRGBA(nearbyImages[1][1].getPixelColor(zm2[0], zm2[1]));
      }

      if (p2m2[0] > 1919 && p2m2[1] < 0) {
        p2m2Color = await Jimp.intToRGBA(nearbyImages[0][2].getPixelColor(p2m2[0] - 1920, 937 + p2m2[1]));
      } else if (p2m2[0] > 1919) {
        p2m2Color = await Jimp.intToRGBA(nearbyImages[1][2].getPixelColor(p2m2[0] - 1920, p2m2[1]));
      } else if (p2m2[1] < 0) {
        p2m2Color = await Jimp.intToRGBA(nearbyImages[0][1].getPixelColor(p2m2[0], 937 + p2m2[1]));
      } else {
        p2m2Color = await Jimp.intToRGBA(nearbyImages[1][1].getPixelColor(p2m2[0], p2m2[1]));
      }

      if (m1m1[0] < 0 && m1m1[1] < 0) {
        m1m1Color = await Jimp.intToRGBA(nearbyImages[0][0].getPixelColor(1920 + m1m1[0], 937 + m1m1[1]));
      } else if (m1m1[0] < 0) {
        m1m1Color = await Jimp.intToRGBA(nearbyImages[1][0].getPixelColor(1920 + m1m1[0], m1m1[1]));
      } else if (m1m1[1] < 0) {
        m1m1Color = await Jimp.intToRGBA(nearbyImages[0][1].getPixelColor(m1m1[0], 937 + m1m1[1]));
      } else {
        m1m1Color = await Jimp.intToRGBA(nearbyImages[1][1].getPixelColor(m1m1[0], m1m1[1]));
      }

      if (zm1[1] < 0) {
        zm1Color = await Jimp.intToRGBA(nearbyImages[0][1].getPixelColor(zm1[0], 937 + zm1[1]));
      } else {
        zm1Color = await Jimp.intToRGBA(nearbyImages[1][1].getPixelColor(zm1[0], zm1[1]));
      }

      if (p1m1[0] > 1919 && p1m1[1] < 0) {
        p1m1Color = await Jimp.intToRGBA(nearbyImages[0][2].getPixelColor(p1m1[0] - 1920, 937 + p1m1[1]));
      } else if (p1m1[0] > 1919) {
        p1m1Color = await Jimp.intToRGBA(nearbyImages[1][2].getPixelColor(p1m1[0] - 1920, p1m1[1]));
      } else if (p1m1[1] < 0) {
        p1m1Color = await Jimp.intToRGBA(nearbyImages[0][1].getPixelColor(p1m1[0], 937 + p1m1[1]));
      } else {
        p1m1Color = await Jimp.intToRGBA(nearbyImages[1][1].getPixelColor(p1m1[0], p1m1[1]));
      }

      if (m2z[0] < 0) {
        m2zColor = await Jimp.intToRGBA(nearbyImages[1][0].getPixelColor(1920 + m2z[0], m2z[1]));
      } else {
        m2zColor = await Jimp.intToRGBA(nearbyImages[1][1].getPixelColor(m2z[0], m2z[1]));
      }

      if (m1z[0] < 0) {
        m1zColor = await Jimp.intToRGBA(nearbyImages[1][0].getPixelColor(1920 + m1z[0], m1z[1]));
      } else {
        m1zColor = await Jimp.intToRGBA(nearbyImages[1][1].getPixelColor(m1z[0], m1z[1]));
      }

      zzColor = Jimp.intToRGBA(nearbyImages[1][1].getPixelColor(zz[0], zz[1]));

      if (p1z[0] > 1919) {
        p1zColor = await Jimp.intToRGBA(nearbyImages[1][2].getPixelColor(p1z[0] - 1920, p1z[1]));
      } else {
        p1zColor = await Jimp.intToRGBA(nearbyImages[1][1].getPixelColor(p1z[0], p1z[1]));
      }

      if (p2z[0] > 1919) {
        p2zColor = await Jimp.intToRGBA(nearbyImages[1][2].getPixelColor(p2z[0] - 1920, p2z[1]));
      } else {
        p2zColor = await Jimp.intToRGBA(nearbyImages[1][1].getPixelColor(p2z[0], p2z[1]));
      }

      if (m1p1[0] < 0 && m1p1[1] > 937) {
        m1p1Color = await Jimp.intToRGBA(nearbyImages[2][0].getPixelColor(1920 + m1p1[0], m1p1[1] - 937));
      } else if (m1p1[0] < 0) {
        m1p1Color = await Jimp.intToRGBA(nearbyImages[1][0].getPixelColor(1920 + m1p1[0], m1p1[1]));
      } else if (m1p1[1] > 937) {
        m1p1Color = await Jimp.intToRGBA(nearbyImages[2][1].getPixelColor(m1p1[0], m1p1[1] - 937));
      } else {
        m1p1Color = await Jimp.intToRGBA(nearbyImages[1][1].getPixelColor(m1p1[0], m1p1[1]));
      }

      if (zp1[1] > 937) {
        zp1Color = await Jimp.intToRGBA(nearbyImages[2][1].getPixelColor(zp1[0], zp1[1] - 937));
      } else {
        zp1Color = await Jimp.intToRGBA(nearbyImages[1][1].getPixelColor(zp1[0], zp1[1]));
      }

      if (p1p1[0] > 1919 && p1p1[1] > 937) {
        p1p1Color = await Jimp.intToRGBA(nearbyImages[2][2].getPixelColor(p1p1[0] - 1920, p1p1[1] - 937));
      } else if (p1p1[0] > 1919) {
        p1p1Color = await Jimp.intToRGBA(nearbyImages[1][2].getPixelColor(p1p1[0] - 1920, p1p1[1]));
      } else if (p1p1[1] > 937) {
        p1p1Color = await Jimp.intToRGBA(nearbyImages[2][1].getPixelColor(p1p1[0], p1p1[1] - 937));
      } else {
        p1p1Color = await Jimp.intToRGBA(nearbyImages[1][1].getPixelColor(p1p1[0], p1p1[1]));
      }

      if (m2p2[0] < 0 && m2p2[1] > 937) {
        m2p2Color = await Jimp.intToRGBA(nearbyImages[2][0].getPixelColor(m2p2[0] + 1920, m2p2[1] - 937));
      } else if (m2p2[0] > 1919) {
        m2p2Color = await Jimp.intToRGBA(nearbyImages[1][0].getPixelColor(m2p2[0] + 1920, m2p2[1]));
      } else if (m2p2[1] > 937) {
        m2p2Color = await Jimp.intToRGBA(nearbyImages[2][1].getPixelColor(m2p2[0], m2p2[1] - 937));
      } else {
        m2p2Color = await Jimp.intToRGBA(nearbyImages[1][1].getPixelColor(m2p2[0], m2p2[1]));
      }

      if (zp2[1] > 937) {
        zp2Color = await Jimp.intToRGBA(nearbyImages[2][1].getPixelColor(zp2[0], zp2[1] - 937));
      } else {
        zp2Color = await Jimp.intToRGBA(nearbyImages[1][1].getPixelColor(zp2[0], zp2[1]));
      }

      if (p2p2[0] > 1919 && p2p2[1] > 937) {
        p2p2Color = await Jimp.intToRGBA(nearbyImages[2][2].getPixelColor(p2p2[0] - 1920, p2p2[1] - 937));
      } else if (p2p2[0] > 1919) {
        p2p2Color = await Jimp.intToRGBA(nearbyImages[1][2].getPixelColor(p2p2[0] - 1920, p2p2[1]));
      } else if (p2p2[1] > 937) {
        p2p2Color = await Jimp.intToRGBA(nearbyImages[2][1].getPixelColor(p2p2[0], p2p2[1] - 937));
      } else {
        p2p2Color = await Jimp.intToRGBA(nearbyImages[1][1].getPixelColor(p2p2[0], p2p2[1]));
      }

      if (process.env.NODE_ENV == "proxmox") {
        const tf = require("@tensorflow/tfjs-node-gpu");
        const model = await tf.loadLayersModel(`file://${path.join(__dirname, "../model/model.json")}`);
        await tf.tidy(() => {
          const input = tf.tensor2d([
            [
              m2m2Color.r,
              m2m2Color.g,
              m2m2Color.b,
              zm2Color.r,
              zm2Color.g,
              zm2Color.b,
              p2m2Color.r,
              p2m2Color.g,
              p2m2Color.b,
              m1m1Color.r,
              m1m1Color.g,
              m1m1Color.b,
              zm1Color.r,
              zm1Color.g,
              zm1Color.b,
              p1m1Color.r,
              p1m1Color.g,
              p1m1Color.b,
              m2zColor.r,
              m2zColor.g,
              m2zColor.b,
              m1zColor.r,
              m1zColor.g,
              m1zColor.b,
              zzColor.r,
              zzColor.g,
              zzColor.b,
              p1zColor.r,
              p1zColor.g,
              p1zColor.b,
              p2zColor.r,
              p2zColor.g,
              p2zColor.b,
              m1p1Color.r,
              m1p1Color.g,
              m1p1Color.b,
              zp1Color.r,
              zp1Color.g,
              zp1Color.b,
              p1p1Color.r,
              p1p1Color.g,
              p1p1Color.b,
              m2p2Color.r,
              m2p2Color.g,
              m2p2Color.b,
              zp2Color.r,
              zp2Color.g,
              zp2Color.b,
              p2p2Color.r,
              p2p2Color.g,
              p2p2Color.b,
            ],
          ]);
          const fs = require("fs");
          const labelList = ["land", "water", "depthLine", "depthNumber"];
          let results = model.predict(input);
          let argMax = results.argMax(1);
          let index = argMax.dataSync()[0];
          let label = labelList[index];
          predictions.push(label);

          console.log("x: " + x + " | y: " + y + " | xImg: " + imgX + " | yImg: " + imgY + " | label: " + label);
        });
      }
      //     }
      //   }
    }
  }
};

function loadNearbyImages(nearbyImages) {
  return new Promise(async (resolve) => {
    for (let a = 0; a < 3; a++) {
      for (let b = 0; b < 3; b++) {
        if (nearbyImages[a][b] !== null) {
          nearbyImages[a][b] = await loadImage(nearbyImages[a][b]);
        } else {
          console.log(null);
        }
      }
    }
    resolve(nearbyImages);
  });
}

function loadImage(path) {
  console.log("loading image: " + path);
  return new Promise((resolve, reject) => {
    Jimp.read(path)
      .then((image) => {
        console.log(image.bitmap.width);
        console.log(image.bitmap.height);
        console.log("image loaded");
        resolve(image);
      })
      .catch((err) => {
        reject(err);
      });
  });
}
