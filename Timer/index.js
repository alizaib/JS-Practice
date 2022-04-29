const durationInput = document.querySelector("#duration");
const startButton = document.querySelector("#start");
const pauseButton = document.querySelector("#pause");
const circle = document.querySelector("circle");
const perimeter = 2 * Math.PI * circle.getAttribute("r");

circle.setAttribute("stroke-dasharray", perimeter);

let total = 0;

const timer = new Timer(durationInput, startButton, pauseButton, {
    onStart(totalDuration) {
        total = totalDuration;
    },
    onTick(timeRemaining) {
        let currentOffset = (timeRemaining * perimeter) / total - perimeter;
        circle.setAttribute("stroke-dashoffset", currentOffset);
    },
    onComplete() {
        console.log("timer stopped");
    },
});
