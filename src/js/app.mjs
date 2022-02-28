import {Session} from './models/session.mjs';
import {AppView} from './app-view.mjs';

const getDefaultOptions = () => ({
  alarm: {
    volume: 0.4,
    sound: getAlarmSounds()[0],
  },
  sessionDuration: {
    work: 25,
    break: 5,
  },
});

const getAlarmSounds = () => [
  {id: '0', name: 'Default', url: 'audio/default.wav'},
  {id: '1', name: 'Geese', url: 'audio/geese.mp3'},
  {id: '2', name: 'Huge bell', url: 'audio/hugebell.wav'},
  {id: '3', name: 'Police siren', url: 'audio/police.wav'},
  {id: '4', name: 'Railroad crossing bell', url: 'audio/railroad.wav'},
  {id: '5', name: 'Rooster', url: 'audio/rooster.wav'},
  {id: '6', name: 'Warning siren', url: 'audio/warningsiren.wav'},
  {id: '7', name: 'Whistling', url: 'audio/whistling.wav'},
];

export class App {
  constructor(rootElement) {
    this._options = getDefaultOptions();
    this._currentSession = null;

    const appView = new AppView(
      {
        alarmSounds: getAlarmSounds(),
        onTimerStart: () => this._onStartTimerClicked(),
        onTimerStop: () => this._onStopTimerClicked(),
        onTimerPause: () => this._onPauseTimerClicked(),
        onTimerResume: () => this._onResumeTimerClicked(),
        onTimerReset: () => this._onResetTimerClicked(),
        onOptionsSave: (value) => this._onOptionsSave(value),
        onOptionsReset: () => this._onOptionsReset(),
      },
      {options: this.options, session: this.currentSession}
    );

    rootElement.append(appView.rootElement);
  }

  set currentSession(value) {
    this._currentSession = value;
    appView.currentSession = this._currentSession;
  }

  get currentSession() {
    return this._currentSession;
  }

  get options() {
    return this._options;
  }

  set options(value) {
    this._options = value;
  }

  _onStartTimerClicked() {
    this.currentSession = Session.getInitialSession(
      this._options.sessionDuration,
      _getSessionEvents()
    );
    this.currentSession.start();
    appView.timerState = TimerState.Running;
  }

  _onStopTimerClicked() {
    this.currentSession.stop();
    this.currentSession = null;
    appView.timerState = TimerState.Stopped;
  }

  _onPauseTimerClicked() {
    this.currentSession.pause();
    appView.timerState = TimerState.Paused;
  }

  _onResumeTimerClicked() {
    this.currentSession.resume();
    appView.timerState = TimerState.Running;
  }

  _onResetTimerClicked() {
    const wasRunning = timer.isRunning;
    this.currentSession = Session.getInitialSession(this._options);
    wasRunning && timer.run();
  }

  _onOptionsReset() {
    this.options = getDefaultOptions();
    return this.options;
  }

  _onOptionsSave(newOptions) {
    this.options = newOptions;
  }

  _onSessionEnd() {
    appView.ringAlarm();
    this.currentSession = this.currentSession.getNext(_getSessionEvents());
    this.currentSession.start();
  }

  _onSessionTick({elapsedTime}) {
    appView.elapsedTime = elapsedTime;
  }

  _getSessionEvents() {
    return {
      onSessionEnd,
      onSessionTick,
    };
  }
}
