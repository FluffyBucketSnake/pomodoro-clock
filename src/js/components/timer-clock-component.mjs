import {$$} from '../ui.mjs';

import {TimerState} from '../models/timer.mjs';
import {toMillisecs, toSecs} from '../models/time.mjs';

export const SessionType = {
  Work: 0,
  Break: 1,
};

export class TimerClockComponent {
  constructor() {
    ({
      rootElement: this._rootElement,
      spanTime: this._spanTime,
      spanState: this._spanState,
      spanSession: this._spanSession,
    } = this._createDOM());
    this.duration = 0;
    this.elapsedTime = 0;
    this.session = 0;
    this.sessionType = SessionType.Work;
    this.timerState = TimerState.Stopped;
  }

  set duration(value) {
    this._duration = value;
    this._updateTimeText();
    this._updateGradient();
  }

  set elapsedTime(value) {
    this._elapsedTime = value;
    this._updateTimeText();
    this._updateGradient();
  }

  set session(value) {
    this._session = value;
    this._updateSessionText();
  }

  set sessionType(value) {
    this._sessionType = value;
    this._updateStateText();
    this._updateRootElementClasses();
  }

  set timerState(value) {
    this._timerState = value;
    this._updateStateText();
    this._updateRootElementClasses();
  }

  get rootElement() {
    return this._rootElement;
  }

  _createDOM() {
    const spanTime = $$('span', 'pc-tc-time');
    const spanState = $$('span', 'pc-tc-state');
    const spanSession = $$('span', 'pc-tc-session');

    const timerOverlay = $$('div', 'pc-tc-overlay').append(
      spanTime,
      spanState,
      spanSession
    );

    const rootElement = $$('div', 'pc-tc mx-auto mb-5').append(timerOverlay);

    return {rootElement, spanTime, spanState, spanSession};
  }

  _updateTimeText() {
    this._spanTime.text(getTimeText(this._duration, this._elapsedTime));
  }

  _updateSessionText() {
    this._spanSession.text(getSessionText(this._session));
  }

  _updateStateText() {
    this._spanState.text(getStateText(this._timerState, this._sessionType));
  }

  _updateGradient() {
    const progressValue =
      this._duration != 0 ? this._elapsedTime / this._duration : 0;
    const foregroundColor = this._rootElement.css('background-color');
    const backgroundColor = '#e9ecef';
    this._rootElement.css(
      'background-image',
      createClockGradient(progressValue, foregroundColor, backgroundColor)
    );
  }

  _updateRootElementClasses() {
    this._rootElement.removeClass(PomodoroClockState.Inactive);
    this._rootElement.removeClass(PomodoroClockState.Work);
    this._rootElement.removeClass(PomodoroClockState.Break);
    const newClass = getPomodoroClockState(this._timerState, this._sessionType);
    this._rootElement.addClass(newClass);
    this._updateGradient();
  }
}

const PomodoroClockState = {
  Inactive: 'inactive',
  Work: 'work',
  Break: 'break',
};

function getTimeText(duration, elapsedTime) {
  const durationInSeconds = Math.floor(toSecs(duration));
  const elapsedSeconds = Math.floor(toSecs(elapsedTime));
  const remainingSeconds = durationInSeconds - elapsedSeconds;
  const seconds = remainingSeconds % 60;
  const minutes = (remainingSeconds - seconds) / 60;

  const textTime = `${padNumberLeft(minutes)}:${padNumberLeft(seconds)}`;
  return textTime;
}

const padNumberLeft = (number, padding = 2) =>
  `${'0'.repeat(padding)}${number}`.slice(-padding);

function getStateText(state, sessionType) {
  const isBreak = sessionType !== SessionType.Break;
  switch (state) {
    case TimerState.Running:
      return `${isBreak ? 'Work' : 'Break'}`;
    case TimerState.Paused:
      return `${isBreak ? 'Work' : 'Break'}(Paused)`;
    case TimerState.Stopped:
    default:
      return 'Ready?';
  }
}

const getSessionText = (session) => `Session ${session}`;

function createClockGradient(progress, foregroundColor, backgroundColor) {
  const deg = progress * 360;
  if (deg > 180) {
    return `linear-gradient(${
      deg + 180
    }deg, ${backgroundColor} 50%, transparent 50%), linear-gradient(180deg, ${foregroundColor} 50%, ${backgroundColor} 50%)`;
  } else {
    return `linear-gradient(${deg}deg, ${foregroundColor} 50%, transparent 50%), linear-gradient(180deg, ${foregroundColor} 50%, ${backgroundColor} 50%)`;
  }
}

function getPomodoroClockState(timerState, sessionType) {
  if (timerState === TimerState.Stopped) {
    return PomodoroClockState.Inactive;
  }
  switch (sessionType) {
    case SessionType.Break:
      return PomodoroClockState.Break;
    case SessionType.Work:
      return PomodoroClockState.Work;
    default:
      return PomodoroClockState.Inactive;
  }
}
