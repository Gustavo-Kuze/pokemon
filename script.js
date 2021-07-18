let timer = null;
let counter = 1;

const img = document.getElementById("img-pokemon");
const predictionImage = document.getElementById("predict-img");
const result = document.getElementById("result");
let dropZone = document.getElementById("app");

const startLoading = () => {
  img.classList.remove("hidden");
  result.classList.add("hidden");
  timer = setInterval(() => {
    img.src = `./assets/silhueta${counter}.png`;
    counter = counter === 4 ? 1 : counter + 1;
  }, 150);
};

const stopLoading = () => {
  result.classList.remove("hidden");
  img.classList.remove("hidden");
  clearInterval(timer);
};

const showResults = ({ className, probability }) => {
  stopLoading();
  img.src = `./assets/${className}.png`;
  result.innerText = `Tenho ${(probability * 100).toFixed(2)}% de certeza de que é um ${className}`
};

// startLoading();
// setTimeout(() => {
//   result.classList.remove("hidden");
//   img.src = `./assets/pikachu.png`;
//   stopLoading();
// }, 5000);

dropZone.addEventListener("dragover", function (e) {
  e.stopPropagation();
  e.preventDefault();
  e.dataTransfer.dropEffect = "copy";
});

dropZone.addEventListener("drop", function (e) {
  e.stopPropagation();
  e.preventDefault();
  startLoading();
  let files = e.dataTransfer.files;
  for (let i = 0, file; (file = files[i]); i++) {
    if (file.type.match(/image.*/)) {
      let reader = new FileReader();

      reader.onload = async function (e2) {
        // let img = document.createElement("img");
        predictionImage.src = e2.target.result;
        // document.body.appendChild(img);
        setTimeout(async () => {
            await predict();
            stopLoading();
        }, 2000);
      };

      reader.readAsDataURL(file);
    }
  }
});

const URL = "./model/";

let model, webcam, labelContainer, maxPredictions;

const modelURL = URL + "model.json";
const metadataURL = URL + "metadata.json";

(async () => {
  model = await tmImage.load(modelURL, metadataURL);
  maxPredictions = model.getTotalClasses();
})();

async function predict() {
  const predictions = await model.predict(predictionImage);
  const res = predictions.reduce((a, b) =>
    a.probability > b.probability ? a : b
  );

  showResults(res);
}
