const CLOCK_REVOLUTION_TIME = 1000;

export class Clock {
  constructor(onTick) {
    this._onTick = onTick;
    this._timeout = null;
    this._timeSinceLastTick = null;
  }

  get isRunning() {
    return !!this._timeout;
  }

  start() {
    if (!this.isRunning) {
      this._scheduleTick(Date.now());
    }
  }

  stop() {
    if (this.isRunning) {
      clearInterval(this._timeout);
      this._timeout = null;
    }
  }

  _scheduleTick(currentTime) {
    this._timeSinceLastTick = currentTime;
    this._timeout = setTimeout(() => this._tick(), CLOCK_REVOLUTION_TIME);
  }

  _tick() {
    const currentTime = Date.now();
    const deltaTime = currentTime - this._timeSinceLastTick;
    this._onTick(deltaTime);
    this._scheduleTick(currentTime);
  }
}
