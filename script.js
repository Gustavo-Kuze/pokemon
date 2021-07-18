let model, maxPredictions;

const modelURL = "./model/model.json";
const metadataURL = "./model/metadata.json";

const loadFile = (dropEvent) => {
  startLoading();
  let files = dropEvent.dataTransfer.files;
  for (let i = 0, file; (file = files[i]); i++) {
    if (file.type.match(/image.*/)) {
      let reader = new FileReader();

      reader.onload = async function (droppedImage) {
        predictionImage.src = droppedImage.target.result;

        setTimeout(async () => {
          await predict();
        }, 1500);
      };

      reader.readAsDataURL(file);
    }
  }
};

const loadModel = async () => {
  model = await tmImage.load(modelURL, metadataURL);
  maxPredictions = model.getTotalClasses();
};

loadModel();

async function predict() {
  const predictions = await model.predict(predictionImage);
  const res = predictions.reduce((a, b) =>
    a.probability > b.probability ? a : b
  );

  displayResults(res);
}
