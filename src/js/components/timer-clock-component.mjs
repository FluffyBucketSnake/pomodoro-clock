import {TimerState} from '../timer.mjs';
import {toMillisecs, toSecs} from '../time.mjs';

function pad_left(number, padding = 2) {
  return `${'0'.repeat(padding)}${number}`.slice(-padding);
}

export const SessionType = {
  Work: 0,
  Break: 1,
};

export class TimerClockComponent {
  constructor(elapsedTime, duration, session, sessionType, state) {
    ({
      rootElement: this._rootElement,
      spanTime: this._spanTime,
      spanState: this._spanState,
      spanSession: this._spanSession,
    } = this._createDOM(elapsedTime, duration, session, sessionType, state));
  }

  get rootElement() {
    return this._rootElement;
  }

  _createDOM(elapsedTime, duration, session, sessionType, state) {
    const durationInSeconds = Math.floor(toSecs(duration));
    const elapsedSeconds = Math.floor(toSecs(elapsedTime));
    const remainingSeconds = durationInSeconds - elapsedSeconds;
    const seconds = remainingSeconds % 60;
    const minutes = (remainingSeconds - seconds) / 60;

    const textTime = `${pad_left(minutes)}:${pad_left(seconds)}`;
    const spanTime = $(`<span id="timer-time">${textTime}</span>`);

    const textState = this._getStateText(state, sessionType);
    const spanState = $(`<span id="timer-state">${textState}</span>`);

    const textSession = `Session ${session}`;
    const spanSession = $(`<span id="timer-session">${textSession}</span>`);

    const timerOverlay = $('<div id="timer-overlay"></div>');
    timerOverlay.append(spanTime);
    timerOverlay.append(spanState);
    timerOverlay.append(spanSession);

    const progress = elapsedTime / duration;
    const rootElement = $('<div id="timer" class="mx-auto mb-5"></div>');
    rootElement.append(timerOverlay);
    rootElement.css('background-image', this._createClockGradient(progress));

    return {rootElement};
  }

  _getStateText(state, sessionType) {
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

  _createClockGradient(progress) {
    const deg = progress * 360;
    const a = '#6c757d';
    const b = '#e9ecef';
    if (deg > 180) {
      return `linear-gradient(${
        deg + 180
      }deg, ${b} 50%, transparent 50%), linear-gradient(180deg, ${a} 50%, ${b} 50%)`;
    } else {
      return `linear-gradient(${deg}deg, ${a} 50%, transparent 50%), linear-gradient(180deg, ${a} 50%, ${b} 50%)`;
    }
  }
}

{
  /* <div id="timer" class="mx-auto mb-5">
  <div id="timer-overlay">
    <span id="timer-time">25:00</span>
    <span id="timer-state">Ready?</span>
    <span id="timer-session">Session 0</span>
  </div>
</div> */
}
