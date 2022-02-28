import {Timer} from '../timer.mjs';

export const SessionType = {
  Work: 0,
  Break: 1,
};

export const SessionState = {
  Idle: 0,
  Running: 1,
  Paused: 2,
  Finished: 3,
  Stopped: 4,
};

export class Session {
  constructor(number, sessionOptions, sessionEvents) {
    this._number = number;
    this._sessionOptions = sessionOptions;
    this._sessionEvents = sessionEvents;

    this._state = SessionState.Idle;
    this._timer = new Timer(
      this.duration * 60 * 1000,
      () => this._onTimerRing(),
      sessionEvents && sessionEvents.onSessionTick
    );
  }

  get number() {
    return this._number;
  }

  get type() {
    return this.number % 2 == 0 ? SessionType.Break : SessionType.Work;
  }

  get duration() {
    switch (this.type) {
      case SessionType.Break:
        return this._sessionOptions.break;
      case SessionType.Work:
      default:
        return this._sessionOptions.work;
    }
  }

  get state() {
    return this._state;
  }

  get isActive() {
    switch (this._state) {
      case SessionState.Running:
      case SessionState.Paused:
        return true;
      default:
        return false;
    }
  }

  static getInitialSession(sessionOptions, sessionEvents) {
    return new Session(1, sessionOptions, sessionEvents);
  }

  getNext(sessionEvents) {
    return new Session(this.number + 1, this._sessionOptions, sessionEvents);
  }

  start() {
    if (this._state !== SessionState.Idle) {
      throw new Error('Cannot start after session has been started once!');
    }
    this._timer.run();
    this._state = SessionState.Running;
  }

  pause() {
    if (this._state !== SessionState.Running) {
      throw new Error('Cannot pause while session is not running!');
    }
    this._timer.pause();
    this._state = SessionState.Paused;
  }

  resume() {
    if (this._state !== SessionState.Paused) {
      throw new Error('Cannot resume while session is not paused!');
    }
    this._timer.run();
    this._state = SessionState.Running;
  }

  stop() {
    if (!this.isActive) {
      throw new Error('Cannot stop session while it is not active!');
    }
    this._timer.stop();
    this._state = SessionState.Stopped;
  }

  _onTimerRing() {
    this._state = SessionState.Finished;
    this._sessionEvents &&
      this._sessionEvents.onSessionEnd &&
      this._sessionEvents.onSessionEnd();
  }
}
