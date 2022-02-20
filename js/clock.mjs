export class Clock {
  constructor(callback) {
    this._callback = callback;
  }

  start() {
    this._interval = setInterval(this._callback, 1000);
  }
};
