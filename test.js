const feedToNeuralNetwork = require("./neuralNetwork/feedToNeuralNetwork.js");

async function start() {
  feedToNeuralNetwork({
    imageDir: "./lakes/GreenwoodReservoir",
    totalCol: 48,
    totalRow: 4,
  });
}

start();
