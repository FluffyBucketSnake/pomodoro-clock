import {TimerState} from '../timer.mjs';

export class TimerControlsComponent {
  constructor(events) {
    events &&
      ({
        onStart: this._onStart,
        onStop: this._onStop,
        onShowOptions: this._onShowOptions,
        onPause: this._onPause,
        onResume: this._onResume,
        onReset: this._onReset,
      } = events);
    ({
      rootElement: this._rootElement,
      buttons: this._buttons,
      secondaryRows: this._secondaryRows,
    } = this._createDOM());
    this.timerState = TimerState.Stopped;
  }

  get rootElement() {
    return this._rootElement;
  }

  get hasBeenStarted() {
    return (
      this._timerState === TimerState.Running ||
      this._timerState === TimerState.Paused
    );
  }

  get isPaused() {
    return this._timerState === TimerState.Paused;
  }

  set timerState(value) {
    if (this._timerState == value) {
      return;
    }
    this._timerState = value;
    if (this.hasBeenStarted) {
      this._buttons.startStop.text('Stop');
      this._buttons.startStop.removeClass('btn-success');
      this._buttons.startStop.addClass('btn-remove');
      this._secondaryRows.stopped.detach();
      this._rootElement.append(this._secondaryRows.started);
      if (this.isPaused) {
        this._buttons.pauseResume.text('Resume');
        this._buttons.pauseResume.removeClass('btn-secondary');
        this._buttons.pauseResume.addClass('btn-success');
      } else {
        this._buttons.pauseResume.text('Pause');
        this._buttons.pauseResume.removeClass('btn-success');
        this._buttons.pauseResume.addClass('btn-secondary');
      }
    } else {
      this._buttons.startStop.text('Start');
      this._buttons.startStop.removeClass('btn-remove');
      this._buttons.startStop.addClass('btn-success');
      this._secondaryRows.started.detach();
      this._rootElement.append(this._secondaryRows.stopped);
    }
  }

  _createDOM() {
    const buttonStartStop = $('<button class="btn col-12"></button>');
    (this._onStart || this._onStop) &&
      buttonStartStop.on('click', () => this._onStartStop());
    const buttonOptions = $(
      '<button class="btn btn-secondary col-12">Options</button>'
    );
    this._onShowOptions &&
      buttonOptions.on('click', () => this._onShowOptions());
    const buttonPauseResume = $(
      '<button class="btn btn-secondary col-12 col-md-5 mr-auto mb-2"></button>'
    );
    (this._onPause || this._onStop) &&
      buttonPauseResume.on('click', () => this._onPauseResume());
    const buttonReset = $(
      '<button class="btn btn-secondary col-12 col-md-5 mr-auto mb-2">Reset</button>'
    );
    this._onReset && buttonReset.on('click', () => this._onReset());

    const rowMain = $('<div class="row mb-2"></div>');
    rowMain.append(buttonStartStop);
    const rowSecondaryStopped = $('<div class="row mb-2"></div>');
    rowSecondaryStopped.append(buttonOptions);
    const rowSecondaryStarted = $('<div class="row mb-2"></div>');
    rowSecondaryStarted.append(buttonPauseResume);
    rowSecondaryStarted.append(buttonReset);

    const rootElement = $('<div class="container"></div>');
    rootElement.append(rowMain);

    return {
      rootElement,
      buttons: {
        startStop: buttonStartStop,
        options: buttonOptions,
        pauseResume: buttonPauseResume,
        reset: buttonReset,
      },
      secondaryRows: {
        stopped: rowSecondaryStopped,
        started: rowSecondaryStarted,
      },
    };
  }

  _onStartStop() {
    if (this.hasBeenStarted) {
      this._onStop && this._onStop();
    } else {
      this._onStart && this._onStart();
    }
  }

  _onPauseResume() {
    if (this.isPaused) {
      this._onResume && this._onResume();
    } else {
      this._onPause && this._onPause();
    }
  }
  /* <section class="container">
  <div id="panel-controls">
    <div class="row mb-2">
      <button id="btn-start" class="btn btn-success col-12">
        Start
      </button>
    </div>
    <div id="panel-subcontrols" class="row mb-2">
      <button
        id="btn-pause"
        class="btn btn-secondary col-12 col-md-5 mr-auto mb-2"
      >
        Pause
      </button>
      <button id="btn-reset" class="btn btn-secondary col-12 col-md-5 mb-2">
        Reset
      </button>
    </div>
    <div id="panel-options" class="row mb-2">
      <button
        id="btn-options"
        class="btn btn-secondary col-12"
        data-toggle="modal"
        data-target="#modal-options"
      >
        Options
      </button>
    </div>
  </div>
</section>; */
}
