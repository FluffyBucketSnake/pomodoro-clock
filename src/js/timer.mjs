import {Clock} from './clock.mjs';

export const TimerState = {
  Stopped: 0,
  Running: 1,
  Paused: 2,
};

export class Timer {
  constructor(duration, onRing) {
    this._duration = duration;
    this._onRing = onRing;
    this._clock = new Clock((deltaTime) => this._onClockTick(deltaTime));
    this._state = TimerState.Stopped;
    this._elapsedTime = 0;
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
    this._clock.start();
    this._state = TimerState.Running;
  }

  _onClockTick(deltaTime) {
    this._elapsedTime = Math.min(this._elapsedTime + deltaTime, this._duration);
    if (this._elapsedTime === this._duration) {
      this._ring();
    }
  }

  _ring() {
    this._state = TimerState.Stopped;
    this._onRing();
  }
}
