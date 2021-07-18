const onDrop = (dropEvent) => {
  dropEvent.stopPropagation();
  dropEvent.preventDefault();

  startLoading();

  let file = dropEvent.dataTransfer.files[0];

  if (file.type.match(/image.*/)) {
    let reader = new FileReader();

    reader.onload = async function (droppedImage) {
      predictionImage.src = droppedImage.target.result;

      setTimeout(async () => {
        await onImageLoaded();
      }, 1500);
    };

    reader.readAsDataURL(file);
  }
};

dropZone.addEventListener("drop", onDrop);
