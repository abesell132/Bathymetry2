const { loadBaseImage, getLabeledTrainingPixels } = require("./training");
const utils = require("./utils");

async function start() {
  await console.clear();
  await console.log("Loading Base Image...");
  const baseImage = await loadBaseImage();
  await console.clear();
  await console.log("Retrieving Labeled Training Data...");
  const labeledTrainingPixels = await getLabeledTrainingPixels();

  await console.clear();
  await console.log("Parsing Training Data...");
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

  if (process.env.NODE_ENV === "proxmox") {
    const { createModel, trainModel } = require("./neuralNetwork");

    await console.clear();
    await console.log("Creating Model...");
    const model = await createModel();
    let inputs = await tf.tensor2d(colors);
    let labelsTensor = await tf.tensor1d(labels, "int32");
    let outputs = await tf.oneHot(labelsTensor, 4).cast("float32");
    await labelsTensor.dispose();

    await console.clear();
    await console.log("Training model...");
    await trainModel(model, inputs, outputs);
  }
}

start();
