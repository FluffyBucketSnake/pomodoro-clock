const CLOCK_REVOLUTION_TIME = 1000;

export class Clock {
  constructor(onTick) {
    this._onTick = onTick;
    this._timeout = null;
  }

  get isRunning() {
    return !!this._timeout;
  }

  start() {
    if (!this.isRunning) {
      this._timeout = setTimeout(() => this._tick(), CLOCK_REVOLUTION_TIME);
    }
  }

  stop() {
    if (this.isRunning) {
      clearInterval(this._timeout);
      this._timeout = null;
    }
  }

  _tick() {
    this._onTick();
    this._timeout = setTimeout(() => this._tick(), CLOCK_REVOLUTION_TIME);
  }
}
