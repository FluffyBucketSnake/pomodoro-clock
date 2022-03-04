import {$$} from '../ui.mjs';

import {TimerState} from '../models/timer.mjs';
import {toMillisecs, toSecs} from '../models/time.mjs';

export const SessionType = {
  Work: 0,
  Break: 1,
};

export class TimerClockComponent {
  constructor(props) {
    ({
      rootElement: this._rootElement,
      alarmBell: this._alarmBell,
      spanTime: this._spanTime,
      spanState: this._spanState,
      spanSession: this._spanSession,
    } = this._createDOM(props));
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
    this._updateSessionTypeClasses();
  }

  set showBell(value) {
    if (value) {
      this._alarmBell.show();
    } else {
      this._alarmBell.hide();
    }
  }

  set timerState(value) {
    this._timerState = value;
    this._updateStateText();
    this._updateSessionTypeClasses();
  }

  get rootElement() {
    return this._rootElement;
  }

  _createDOM({onAlarmBellClick}) {
    const alarmBell = $$('a', 'btn pc-tc-bell')
      .append(
        `
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 16 16">
        <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zm.995-14.901a1 1 0 1 0-1.99 0A5.002 5.002 0 0 0 3 6c0 1.098-.5 6-2 7h14c-1.5-1-2-5.902-2-7 0-2.42-1.72-4.44-4.005-4.901z"/>
      </svg>
    `
      )
      .hide();
    onAlarmBellClick && alarmBell.click(onAlarmBellClick);

    const spanTime = $$('span', 'pc-tc-time');
    const spanState = $$('span', 'pc-tc-state');
    const spanSession = $$('span', 'pc-tc-session');

    const timerOverlay = $$('div', 'pc-tc-overlay').append(
      alarmBell,
      spanTime,
      spanState,
      spanSession
    );

    const rootElement = $$('div', 'pc-tc mx-auto mb-5').append(timerOverlay);

    return {rootElement, alarmBell, spanTime, spanState, spanSession};
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

  _updateSessionTypeClasses() {
    this._rootElement.removeClass(PomodoroClockStates);
    this._alarmBell.removeClass(PomodoroClockStates);
    this._spanTime.removeClass(PomodoroClockStates);
    const newClass = getPomodoroClockState(this._timerState, this._sessionType);
    this._rootElement.addClass(newClass);
    this._alarmBell.addClass(newClass);
    this._spanTime.addClass(newClass);
    this._updateGradient();
  }
}

const PomodoroClockState = {
  Inactive: 'inactive',
  Work: 'work',
  Break: 'break',
};

const PomodoroClockStates = Object.values(PomodoroClockState);

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
