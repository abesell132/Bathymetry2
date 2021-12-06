const tf = require("@tensorflow/tfjs-node-gpu");

module.exports = NeuralNetwork = {
  createModel: function (LEARNING_RATE = 0.1) {
    const optimizer = tf.train.sgd(LEARNING_RATE);

    let model = tf.sequential();

    let hiddenLayer = tf.layers.dense({ units: 40, inputShape: [51], activation: "sigmoid" });
    let outputLayer = tf.layers.dense({ units: 4, activation: "softmax" });

    model.add(hiddenLayer);
    model.add(outputLayer);

    model.compile({
      optimizer: optimizer,
      loss: "categoricalCrossentropy",
      metrics: ["accuracy"],
    });

    return model;
  },
  trainModel: function (model, inputs, outputs) {
    return new Promise((resolve) => {
      if (NeuralNetwork.isTraining) return;
      NeuralNetwork.isTraining = true;
      model.fit(inputs, outputs, {
        shuffle: true,
        validationSplit: 0.1,
        epochs: 10,
        callbacks: {
          onBatchEnd: async (batch, logs) => {
            await tf.nextFrame();
          },
          onTrainEnd: () => {
            NeuralNetwork.isTraining = false;
            resolve();
          },
        },
      });
    });
  },
};
