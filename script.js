let model;

const modelURL = "./model/model.json";
const metadataURL = "./model/metadata.json";

const loadModel = async () => {
  model = await tmImage.load(modelURL, metadataURL);
};

loadModel();

async function classify() {
  const predictions = await model.predict(predictionImage);
  const res = predictions.reduce((a, b) =>
    a.probability > b.probability ? a : b
  );

  displayResults(res);
}

const onImageLoaded = async () => {
  await classify();
};
