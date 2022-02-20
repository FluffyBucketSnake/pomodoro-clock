import {Clock} from './clock.mjs';

export const TimerState = {
  Stopped: 0,
  Running: 1,
  Paused: 2,
};

export class Timer {
  constructor(onRing, clock = new Clock()) {
    this._onRing = onRing;
    this._clock = clock;
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
}
