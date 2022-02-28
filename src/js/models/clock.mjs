export const CLOCK_REVOLUTION_TIME = 1000;

export class Clock {
  constructor(onTick) {
    this._onTick = onTick;
    this._timeout = null;
    this._timeSinceLastTick = null;
  }

  get isRunning() {
    return !!this._timeout;
  }

  start(timeTillFirstTick = CLOCK_REVOLUTION_TIME) {
    if (!this.isRunning) {
      this._timeSinceLastTick = Date.now();
      this._scheduleTick(timeTillFirstTick);
    }
  }

  stop() {
    if (this.isRunning) {
      clearTimeout(this._timeout);
      this._timeout = null;
    }
  }

  _scheduleTick(timeTillTick = CLOCK_REVOLUTION_TIME) {
    this._timeout = setTimeout(() => this._tick(), timeTillTick);
  }

  _tick() {
    const currentTime = Date.now();
    const deltaTime = currentTime - this._timeSinceLastTick;
    this._onTick(deltaTime);
    this._timeSinceLastTick = currentTime;
    const readjustedTickTime =
      CLOCK_REVOLUTION_TIME - (deltaTime % CLOCK_REVOLUTION_TIME);
    this.isRunning && this._scheduleTick(readjustedTickTime);
  }
}
