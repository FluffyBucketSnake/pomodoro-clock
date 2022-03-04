import {TimerClockComponent} from './components/timer-clock-component.mjs';
import {TimerControlsComponent} from './components/timer-controls-component.mjs';
import {PomodoroConfigModal} from './modals/pomodoro-config-modal.mjs';

import {$$} from './ui.mjs';
import {Session} from './models/session.mjs';

export class AppView {
  constructor(props, {options: initialOptions, timerState: initialTimerState}) {
    this._currentSession = null;
    this._elapsedTime = 0;
    this._options = initialOptions;
    this._timerState = initialTimerState;
    ({
      rootElement: this._rootElement,
      timerClockComponent: this._timerClockComponent,
      timerControlsComponent: this._timerControlsComponent,
      audioAlarm: this._audioAlarm,
      configModal: this._configModal,
    } = this._createDOM(props));
    this.currentSession = null;
  }

  get rootElement() {
    return this._rootElement;
  }

  set currentSession(value) {
    this._currentSession = value;
    if (value) {
      this._timerClockComponent.session = value.number;
      this._timerClockComponent.sessionType = value.type;
      this._timerClockComponent.duration = value.duration * 60 * 1000;
    } else {
      this._timerClockComponent.session = 0;
      this._timerClockComponent.sessionType = -1;
      this._timerClockComponent.duration =
        Session.getInitialSession(this._options.session).duration * 60 * 1000;
    }
    this.elapsedTime = 0;
  }

  set elapsedTime(value) {
    this._elapsedTime = value;
    this._timerClockComponent.elapsedTime = value;
  }

  set timerState(value) {
    this._timerState = value;
    this._timerClockComponent.timerState = value;
    this._timerControlsComponent.timerState = value;
  }

  ringAlarm() {
    this._audioAlarm[0].play();
    this._timerClockComponent.showBell = true;
  }

  stopAlarm() {
    this._audioAlarm[0].pause();
    this._audioAlarm[0].src = this._audioAlarm[0].src;
    this._timerClockComponent.showBell = false;
  }

  _createDOM({
    alarmSounds,
    onTimerStart,
    onTimerStop,
    onTimerPause,
    onTimerResume,
    onTimerReset,
    onOptionsSave,
    onOptionsReset,
  }) {
    const timerClockComponent = new TimerClockComponent({
      onAlarmBellClick: () => this.stopAlarm(),
    });

    const timerControlsEvents = {
      onStart: onTimerStart,
      onStop: onTimerStop,
      onPause: onTimerPause,
      onResume: onTimerResume,
      onReset: onTimerReset,
      onShowOptions: () => this._configModal.show(),
    };
    const timerControlsComponent = new TimerControlsComponent(
      timerControlsEvents
    );

    const currentAlarmSound = this._options.alarm.sound;
    const audioAlarm = $$('audio', '', {
      id: 'audio-alarm',
      preload: 'auto',
      src: currentAlarmSound.url,
    });
    audioAlarm.on('ended', () => this.stopAlarm());
    audioAlarm[0].volume = this._options.alarm.volume;

    const configModal = new PomodoroConfigModal(
      {
        alarmSounds,
        onSave: (newOptions) => this._onSaveOptions(newOptions, onOptionsSave),
        onReset: onOptionsReset,
      },
      this._options
    );

    return {
      rootElement: $$('div', '', {}).append(
        timerClockComponent.rootElement,
        timerControlsComponent.rootElement,
        audioAlarm,
        configModal.rootElement
      ),
      timerClockComponent,
      timerControlsComponent,
      audioAlarm,
      configModal,
    };
  }

  _onSaveOptions(newOptions, next) {
    this._audioAlarm.attr('src', newOptions.alarm.sound.url);
    this._audioAlarm[0].volume = this._options.alarm.volume;
    this._timerClockComponent.duration = this._timerClockComponent.duration =
      Session.getInitialSession(this._options.session).duration * 60 * 1000;
    next(newOptions);
  }
}
