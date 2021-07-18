const onDrop = (dropEvent) => {
  dropEvent.stopPropagation();
  dropEvent.preventDefault();

  loadFile(dropEvent);
};

dropZone.addEventListener("drop", onDrop);
