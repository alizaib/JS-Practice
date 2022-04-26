class Timer {
  constructor(durationInput, startButton, pauseButton) {
    this.durationInput = durationInput;
    this.startButton = startButton;
    this.pauseButton = pauseButton;

    this.startButton.addEventListener("click", this.start);
    this.pauseButton.addEventListener("click", this.pause);
  }

  start = () => {
    this.tick();
    this.interval = setInterval(this.tick, 1000);
  };

  tick = () => {
    this.timeRemaining = this.timeRemaining - 1;
  };

  pause = () => {
    clearInterval(this.interval);
  };

  get timeRemaining() {
    return parseFloat(this.durationInput.value);
  }

  set timeRemaining(timeRemaining) {
    this.durationInput.value = timeRemaining;
  }
}
