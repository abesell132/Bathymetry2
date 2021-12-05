process.on("message", (message) => {
  let { path, colCount, rowCount, totalX, totalY } = message;

  Jimp.read(path)
    .then((image) => {
      let startPixelX = 0;
      let startPixelY = 0;
      let endPixelX = 1919;
      let endPixelY = 936;

      if (colCount == 1) startPixelX = 3;
      if (colCount == totalX) endPixelX = 1916;
      if (rowCount == 1) startPixelY = 3;
      if (rowCount == totalY) endPixelY = 933;

      for (let x = startPixelX; x < endPixelX; x++) {
        for (let y = startPixelY; y < endPixelY; y++) {
          let pixel = image.getPixelColor(x, y);
          let nearbyPixels = getNearbyPixels(image, x, y, colCount, rowCount);
        }
      }
    })
    .catch((err) => {});
});

function getNearbyPixels(image, x, y) {
  let nearbyPixels = [];

  if (x - 2 > 0) {
    let photom1m1 = Jimp.load("");
  }
  let m2m2 = baseImg.getPixelColor(x - 2, y - 2);
}
