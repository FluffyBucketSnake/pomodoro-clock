const CLOCK_RESOLUTION_TIME = 1000;

export class Clock {
  constructor(callback) {
    this._callback = callback;
    this._lastTime = 0;
    this._ellapsedTime = 0;
    this._interval = null;
    this._midCycleTimeout = null;
  }

  start() {
    this._ellapsedTime = 0;
    this._lastTime = Date.now();
    this._startInterval();
  }

  pause() {
    const currentTime = Date.now();
    this._ellapsedTime = currentTime - this._lastTime;
    this._clearInterval();
  }

  reset() {
    this._clearInterval();
    this.start();
  }

  resume() {
    if (this._ellapsedTime !== 0) {
      this._startMidCycleTimeout();
    } else {
      this._startInterval();
    }
  }

  _tick() {
    this._lastTime = Date.now();
    this._callback();
  }

  _startInterval() {
    this._clearInterval();
    this._interval = setInterval(() => this._tick(), CLOCK_RESOLUTION_TIME);
  }

  _clearInterval() {
    if (this._interval) {
      clearInterval(this._interval);
      this._interval = null;
    }
    if (this._midCycleTimeout) {
      clearTimeout(this._midCycleTimeout);
      this._midCycleTimeout = null;
    }
  }

  _startMidCycleTimeout() {
    const remainingTimeUntilResolution =
      CLOCK_RESOLUTION_TIME - this._ellapsedTime;
    this._midCycleTimeout = setTimeout(() => {
      this._tick();
      this._startInterval();
    }, remainingTimeUntilResolution);
  }
}
