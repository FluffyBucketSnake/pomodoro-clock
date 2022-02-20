const CLOCK_RESOLUTION_TIME = 1000;

export const ClockStates = {
  Stopped: 0,
  Running: 1,
  Paused: 2,
};

export class Clock {
  constructor(onTick) {
    this.state = ClockStates.Stopped;
    this._onTick = onTick;
    this._lastTime = 0;
    this._elapsedTime = 0;
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
    switch (this.state) {
      case ClockStates.Stopped:
        this._clearTime();
        this._startInterval();
        break;
      case ClockStates.Running:
        return;
      case ClockStates.Paused:
        this._startMidCycleTimeout();
        break;
    }
    this.state = ClockStates.Running;
  }

  stop() {
    if (this.isStopped) {
      return;
    }
    this._clearInterval();
    this.state = ClockStates.Stopped;
  }

  pause() {
    if (!this.isPaused) {
      const currentTime = Date.now();
      this._elapsedTime = currentTime - this._lastTime;
      this._clearInterval();
      this.state = ClockStates.Paused;
    }
  }

  reset() {
    this._clearTime();
    if (this.isRunning) {
      this._clearInterval();
      this._startInterval();
    }
  }

  _clearTime() {
    this._elapsedTime = 0;
    this._lastTime = Date.now();
  }

  _tick() {
    const currentTime = Date.now();
    this._elapsedTime = currentTime - this._lastTime;
    while (this._elapsedTime >= CLOCK_RESOLUTION_TIME) {
      this._onTick();
      this._elapsedTime -= CLOCK_RESOLUTION_TIME;
    }
    this._lastTime = currentTime - this._elapsedTime;
  }

  _startInterval() {
    this._interval = setInterval(() => this._tick(), CLOCK_RESOLUTION_TIME);
  }

  _clearInterval() {
    clearInterval(this._interval);
    this._interval = null;
    if (this._midCycleTimeout) {
      clearTimeout(this._midCycleTimeout);
      this._midCycleTimeout = null;
    }
  }

  _startMidCycleTimeout() {
    const remainingTimeUntilResolution =
      CLOCK_RESOLUTION_TIME - this._elapsedTime;
    this._midCycleTimeout = setTimeout(() => {
      this._tick();
      this._startInterval();
    }, remainingTimeUntilResolution);
  }
}
