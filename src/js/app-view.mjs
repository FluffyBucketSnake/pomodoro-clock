import {TimerClockComponent} from './components/timer-clock-component.mjs';
import {TimerControlsComponent} from './components/timer-controls-component.mjs';
import {PomodoroConfigModal} from './modals/pomodoro-config-modal.mjs';

import $ from 'jquery';

export class AppView {
  constructor(
    props,
    {
      options: initialOptions,
      session: initialSession,
      timerState: initialTimerState,
    }
  ) {
    this._currentSession = initialSession;
    this._options = initialOptions;
    this._timerState = initialTimerState;
    ({
      rootElement: this._rootElement,
      timerClockComponent: this._timerClockComponent,
      timerControlsComponent: this._timerControlsComponent,
      audioAlarm: this._audioAlarm,
      configModal: this._configModal,
    } = this._createDOM(props));
  }

  get rootElement() {
    return this._rootElement;
  }

  set currentSession(value) {
    this._currentSession = value;
    this._timerClockComponent.session = value.number;
    this._timerClockComponent.sessionType = value.type;
    this._timerClockComponent.duration = value.duration * 60 * 1000;
    this._timerClockComponent.elapsedTime = value.elapsedTime;
  }

  set timerState(value) {
    this._timerState = value;
    this._timerClockComponent.timerState = value;
    this._timerControlsComponent.timerState = value;
  }

  ringAlarm() {
    this._audioAlarm[0].play();
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
    const timerClockComponent = new TimerClockComponent();
    timerClockComponent.session = this._currentSession.number;
    timerClockComponent.sessionType = this._currentSession.type;
    timerClockComponent.duration = this._currentSession.duration * 60 * 1000;
    timerClockComponent.timerState = this._timerState;

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
    const audioAlarm = $(
      `<audio id="audio-alarm" preload="auto" src="${currentAlarmSound.url}" />`
    );
    audioAlarm[0].volume = this._options.alarm.volume;

    const configModal = new PomodoroConfigModal(
      {
        alarmSounds,
        onSave: (newOptions) => {
          this._audioAlarm.attr('src', newOptions.alarm.sound.url);
          this._audioAlarm[0].volume = this._options.alarm.volume;
          onOptionsSave(newOptions);
        },
        onReset: onOptionsReset,
      },
      this._options
    );

    return {
      rootElement: $('<div></div>').append(
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
}
