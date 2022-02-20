const CLOCK_RESOLUTION_TIME = 1000;

export const ClockStates = {
  Stopped: 0,
  Running: 1,
  Paused: 2,
};

export class Clock {
  constructor(callback) {
    this.state = ClockStates.Stopped;
    this._callback = callback;
    this._lastTime = 0;
    this._ellapsedTime = 0;
    this._interval = null;
    this._midCycleTimeout = null;
  }

  get isStopped() {
    return this.state === ClockStates.Stopped;
  }

  get isRunning() {
    return this.state === ClockStates.Running;
  }

  get isPaused() {
    return this.state === ClockStates.Paused;
  }

  run() {
    if (!this.isRunning) {
      this._lastTime = Date.now();
      this._startInterval();
      this.state = ClockStates.Running;
    }
  }

  pause() {
    if (!this.isPaused) {
      const currentTime = Date.now();
      this._ellapsedTime = currentTime - this._lastTime;
      this._clearInterval();
      this.state = ClockStates.Paused;
    }
  }

  reset() {
    if (this._interval) {
      this._clearInterval();
      this.start();
    }
  }

  resume() {
    if (this._ellapsedTime !== 0) {
      this._startMidCycleTimeout();
    } else {
      this._startInterval();
    }
  }

  _tick() {
    const currentTime = Date.now();
    this._ellapsedTime = currentTime - this._lastTime;
    _callbackWithLagCompensation();
    this._lastTime = currentTime - this._ellapsedTime;
  }

  _callbackWithLagCompensation() {
    while (this._ellapsedTime >= CLOCK_RESOLUTION_TIME) {
      this._callback();
      this._ellapsedTime -= CLOCK_RESOLUTION_TIME;
    }
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
