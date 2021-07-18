const img = document.getElementById("img-pokemon");
const predictionImage = document.getElementById("predict-img");
const result = document.getElementById("result");
let dropZone = document.getElementById("app");

let counter = 1;
let model, webcam, labelContainer, maxPredictions;
const modelURL = "./model/model.json";
const metadataURL = "./model/metadata.json";
let isLoading = false;

function updateLoading() {
  if (isLoading) {
    img.src = `./assets/silhueta${counter}.png`;
    counter = counter === 4 ? 1 : counter + 1;
    setTimeout(() => {
      window.requestAnimationFrame(updateLoading);
    }, 100);
  }
}

const startLoading = () => {
  isLoading = true;
  updateLoading();
  img.classList.remove("hidden");
  result.classList.add("hidden");
};

const stopLoading = () => {
  result.classList.remove("hidden");
  img.classList.remove("hidden");
  isLoading = false;
};

const displayResults = ({ className, probability }) => {
  stopLoading();
  img.src = `./assets/${className}.png`;
  result.innerText = `Tenho ${(probability * 100).toFixed(
    2
  )}% de certeza de que é um ${className}`;
};

dropZone.addEventListener("dragover", function (e) {
  e.stopPropagation();
  e.preventDefault();
  e.dataTransfer.dropEffect = "copy";
});

dropZone.addEventListener("drop", function (dropEvent) {
  dropEvent.stopPropagation();
  dropEvent.preventDefault();
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
});

(async () => {
  model = await tmImage.load(modelURL, metadataURL);
  maxPredictions = model.getTotalClasses();
})();

async function predict() {
  const predictions = await model.predict(predictionImage);
  const res = predictions.reduce((a, b) =>
    a.probability > b.probability ? a : b
  );

  displayResults(res);
}
