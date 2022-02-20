import {Clock} from './clock.mjs';

export const TimerState = {
  Stopped: 0,
  Running: 1,
  Paused: 2,
};

export class Timer {
  constructor(duration, onRing, onTick) {
    this._duration = duration;
    this._onRing = onRing;
    this._onTick = onTick;
    this._clock = new Clock((deltaTime) => this._onClockTick(deltaTime));
    this._state = TimerState.Stopped;
    this._elapsedTime = 0;
    this._timeSinceLastTick = 0;
  }

  get state() {
    return this._state;
  }

  get isStopped() {
    return this._state === TimerState.Stopped;
  }

  get isRunning() {
    return this._state === TimerState.Running;
  }

  get isPaused() {
    return this._state === TimerState.Paused;
  }

  get elapsedTime() {
    return this._elapsedTime;
  }

  get remainingTime() {
    return this._duration - this._elapsedTime;
  }

  run() {
    this.isStopped && this.reset();

    this._timeSinceLastTick = Date.now();
    this._clock.start();
    this._state = TimerState.Running;
  }

  pause() {
    if (this.isRunning) {
      const deltaTime = Date.now() - this._timeSinceLastTick;
      this._elapsedTime += deltaTime;
    }
    this._clock.stop();
    this._state = TimerState.Paused;
  }

  reset() {
    this._elapsedTime = 0;
  }

  stop() {
    this._clock.stop();
    this._elapsedTime = 0;
    this._state = TimerState.Stopped;
  }

  _onClockTick(deltaTime) {
    this._timeSinceLastTick = Date.now();
    this._elapsedTime = Math.min(this._elapsedTime + deltaTime, this._duration);
    this._onTick && this._onTick({deltaTime, elapsedTime: this.elapsedTime});
    this.remainingTime === 0 && this._ring();
  }

  _ring() {
    this._clock.stop();
    this._state = TimerState.Stopped;
    this._onRing && this._onRing();
  }
}
