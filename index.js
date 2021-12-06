const { loadBaseImage, getLabeledTrainingPixels } = require("./training");
const feedToNeuralNetwork = require("./neuralNetwork/feedToNeuralNetwork");
const { scrapeLake } = require("./scraper");
const utils = require("./utils");

async function start() {
  const lake = "Lake Bancroft";
  const startPos = { lat: 46.496, lng: -87.6776 };
  const endPos = { lat: 46.4924, lng: -87.6717 };

  await console.time("Loading Base Image...");
  const baseImage = await loadBaseImage();
  await console.timeEnd("Loading Base Image...");

  await console.time("Retrieving Labeled Training Data...");
  const labeledTrainingPixels = await getLabeledTrainingPixels();
  await console.timeEnd("Retrieving Labeled Training Data...");

  await console.time("Parsing Training Data...");
  const numTrainingPoints = 2000;
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

  await console.time("Feeding Image to Neural Network...");
  await feedToNeuralNetwork(lakeImages);
  await console.timeEnd("Feeding Image to Neural Network...");
}

start();
