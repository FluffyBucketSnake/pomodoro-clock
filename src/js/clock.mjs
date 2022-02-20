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
    this._lastTickTime = 0;
    this._elapsedTime = 0;
    this._deltaTime = 0;
    this._timeout = null;
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

  get elapsedTime() {
    let deltaTime = this._deltaTime;
    if (this.isRunning) {
      deltaTime = Date.now() - this._lastTickTime;
    }
    return this._elapsedTime + deltaTime;
  }

  run() {
    switch (this.state) {
      case ClockStates.Stopped:
        this._clearTime();
        this._startTimeout();
        break;
      case ClockStates.Paused:
        this._lastTickTime = Date.now();
        this._startTimeout();
        break;
      case ClockStates.Running:
        return;
    }
    this.state = ClockStates.Running;
  }

  stop() {
    if (this.isStopped) {
      return;
    }
    this._clearTimeout();
    this.state = ClockStates.Stopped;
  }

  pause() {
    if (!this.isPaused) {
      this._deltaTime = Date.now() - this._lastTickTime;
      this._clearTimeout();
      this.state = ClockStates.Paused;
    }
  }

  reset() {
    this._clearTime();
    if (this.isRunning) {
      this._clearTimeout();
      this._startTimeout();
    }
  }

  _clearTime() {
    this._elapsedTime = 0;
    this._deltaTime = 0;
    this._lastTickTime = Date.now();
  }

  _tick() {
    const currentTime = Date.now();
    this._deltaTime += currentTime - this._lastTickTime;
    while (this._deltaTime >= CLOCK_RESOLUTION_TIME) {
      this._elapsedTime += CLOCK_RESOLUTION_TIME;
      if (this._onTick(this._elapsedTime)) {
        this._elapsedTime = 0;
      }
      this._deltaTime -= CLOCK_RESOLUTION_TIME;
    }
    this._lastTickTime = currentTime - this._deltaTime;
    this._clearTimeout();
    this._startTimeout();
  }

  _startTimeout() {
    this._timeout = setTimeout(() => {
      this._tick();
    }, CLOCK_RESOLUTION_TIME - this._deltaTime);
  }

  _clearTimeout() {
    clearTimeout(this._timeout);
  }
}
