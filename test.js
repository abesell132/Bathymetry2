const feedToNeuralNetwork = require("./neuralNetwork/feedToNeuralNetwork.js");

async function start() {
  feedToNeuralNetwork({
    imageDir: "./lakes/GreenwoodReservoir",
    totalCol: 48,
    totalRow: 4,
  });
}

// start();

async function test() {
  console.time("test");
  for (let a = 0; a < 1799040; a++) {
    for (let b = 0; b < 800; b++) {
      c = a * Math.random();
    }
  }
  console.timeEnd("test");
}

test();
