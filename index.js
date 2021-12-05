const { loadBaseImage, getLabeledTrainingPixels } = require("./training");
const feedToNeuralNetwork = require("./neuralNetwork/feedToNeuralNetwork");
const { scrapeLake } = require("./scraper");
const utils = require("./utils");

async function start() {
  const lake = "Teal Lake";
  const startPos = { lat: 46.51824, lng: -87.65525 };
  const endPos = { lat: 46.50696, lng: -87.61136 };

  await console.time("Loading Base Image...");
  const baseImage = await loadBaseImage();
  await console.timeEnd("Loading Base Image...");

  await console.time("Retrieving Labeled Training Data...");
  const labeledTrainingPixels = await getLabeledTrainingPixels();
  await console.timeEnd("Retrieving Labeled Training Data...");

  await console.time("Parsing Training Data...");
  const numTrainingPoints = 10000;
  let colors = [];
  let labels = [];
  for (let a = 0; a < numTrainingPoints; a++) {
    const labelList = ["land", "water", "depthLine", "depthNumber"];
    const trainingPixel = await utils.getRandomNestedArray(labeledTrainingPixels);
    const trainingPixelNeighbors = await utils.findNearestPixels(trainingPixel, baseImage);

    await labels.push(labelList.indexOf(trainingPixel.label));
    await colors.push(trainingPixelNeighbors);
  }
  await console.timeEnd("Parsing Training Data...");

  if (process.env.NODE_ENV === "proxmox") {
    const tf = require("@tensorflow/tfjs-node-gpu");
    const { createModel, trainModel } = require("./neuralNetwork");

    await console.time("Creating Model...");
    const model = await createModel();
    let inputs = await tf.tensor2d(colors);
    let labelsTensor = await tf.tensor1d(labels, "int32");
    let outputs = await tf.oneHot(labelsTensor, 4).cast("float32");
    await labelsTensor.dispose();
    await console.timeEnd("Creating Model...");

    await console.time("Training model...");
    await trainModel(model, inputs, outputs);
    await console.timeEnd("Training model...");

    await model.save(`file://${__dirname}/model`);
  }

  await console.time("Scraping Lake...");
  let lakeImages = await scrapeLake(lake, startPos, endPos);
  await console.timeEnd("Scraping Lake...");

  await feedToNeuralNetwork(lakeImages);
}

start();
