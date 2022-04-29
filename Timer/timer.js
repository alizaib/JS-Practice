get = function (obj, key) {
    return key.split(".").reduce(function (o, x) {
        return typeof o == "undefined" || o === null ? o : o[x];
    }, obj);
};

has = function (obj, key) {
    return key.split(".").every(function (x) {
        if (typeof obj != "object" || obj === null || !x in obj) return false;
        obj = obj[x];
        return true;
    });
};

class Timer {
    constructor(durationInput, startButton, stopButton, callbacks) {
        this.durationInput = durationInput;
        this.startButton = startButton;
        this.stopButton = stopButton;
        this.callbacks = callbacks;

        this.startButton.addEventListener("click", this.start);
        this.stopButton.addEventListener("click", this.stop);
    }

    start = () => {
        if (has(this, "callbacks.onStart")) {
            this.callbacks.onStart(this.timeRemaining);
        }
        this.tick();
        this.interval = setInterval(this.tick, 20);
    };

    tick = () => {
        if (this.timeRemaining > 0) {
            if (has(this, "callbacks.onTick")) {
                this.callbacks.onTick(this.timeRemaining);
            }
            this.timeRemaining = this.timeRemaining - 0.02;
        } else {
            this.stop();
        }
    };

    stop = () => {
        if (has(this, "callbacks.onComplete")) {
            this.callbacks.onComplete();
        }
        clearInterval(this.interval);
    };

    get timeRemaining() {
        return parseFloat(this.durationInput.value);
    }

    set timeRemaining(timeRemaining) {
        this.durationInput.value = timeRemaining.toFixed(2);
    }
}
