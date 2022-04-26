const durationInput = document.querySelector("#duration");
const startButton = document.querySelector("#start");
const puaseButton = document.querySelector("#pause");

const timer = new Timer(durationInput, startButton, puaseButton);
