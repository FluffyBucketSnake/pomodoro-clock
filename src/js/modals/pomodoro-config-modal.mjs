import $ from 'jquery';
import 'bootstrap';
import {SpinButtonComponent} from '../components/spin-button-component.mjs';

function createTitleRow(content) {
  const container = $('<div class="row justify-content-center mb-3"></div>');
  container.append(content);
  return container;
}

function createRow(content) {
  const container = $('<div class="row justify-content-center"></div>');
  container.append(content);
  return container;
}

function createModalHeader(title) {
  return $(`
    <div class="modal-header">
      <h2 class="modal-title">${title}</h2>
      <button type="button" class="close" data-dismiss="modal" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
  `);
}

function createModal(title, body, footer) {
  const modalHeader = createModalHeader(title);
  const modalBody = $('<div class="modal-body"></div>').append(body);
  const modalFooter = $('<div class="modal-footer"></div>').append(footer);
  const modalContent = $('<div class="modal-content"></div>').append(
    modalHeader,
    modalBody,
    modalFooter
  );
  const modalDialog = $('<div class="modal-dialog"></div>').append(
    modalContent
  );
  const modal = $('<div class="modal" tabindex="-1"></div>').append(
    modalDialog
  );
  return modal;
}

export class PomodoroConfigModal {
  constructor(props, value) {
    ({
      rootElement: this._rootElement,
      inputVolume: this._inputVolume,
      inputSound: this._inputSound,
      inputWorkDuration: this._inputWorkDuration,
      inputBreakDuration: this._inputBreakDuration,
    } = this._createDOM(props, value));
    this.currentOptions = value;
  }

  get rootElement() {
    return this._rootElement;
  }

  set currentOptions(value) {
    this._currentOptions = value;
    this._inputVolume.val(value.alarm.volume * 100);
    this._inputSound.val(value.alarm.sound);
    this._inputWorkDuration.value = value.sessionDuration.work;
    this._inputBreakDuration.value = value.sessionDuration.break;
  }

  get currentOptions() {
    return this._currentOptions;
  }

  show() {
    this._rootElement.modal();
  }

  _createDOM(props) {
    const {
      rootElement: body,
      inputVolume,
      inputSound,
      inputWorkDuration,
      inputBreakDuration,
    } = this._createBodyDOM(props);
    const footer = this._createFooterDOM(props);
    const rootElement = createModal('Options', body, footer);

    return {
      rootElement,
      inputVolume,
      inputSound,
      inputWorkDuration,
      inputBreakDuration,
    };
  }

  _createBodyDOM({alarmSounds}) {
    const {
      rootElement: alarmSection,
      inputVolume,
      inputSound,
    } = this._createAlarmSectionDOM(alarmSounds);
    const {
      rootElement: sessionDurationSection,
      inputWorkDuration,
      inputBreakDuration,
    } = this._createSessionDurationSectionDOM();
    const rootElement = $('<div class="container-fluid"></div>').append(
      alarmSection,
      sessionDurationSection
    );
    return {
      rootElement,
      inputVolume,
      inputSound,
      inputWorkDuration,
      inputBreakDuration,
    };
  }

  _createAlarmSectionDOM(sounds) {
    const inputVolume = $(`
      <input 
        type="range" 
        name="volume" 
        id="range-volume" 
        class="mx-0 w-100"
        min="0" 
        max="100"/>`).change(() => this._onInputVolumeChanged());
    const inputSound = $(
      '<select name="sel-sound" id="sel-sound" class="custom-select"></select>'
    )
      .append(
        sounds.map(
          ({name}, index) => `<option value="${index}"}>${name}</option>`
        )
      )
      .change(() => this._onInputSoundChanged());

    const rootElement = $('<section class="mb-5"></section>')
      .append(createTitleRow('<h3>Alarm:</h3>'))
      .append(createRow('<label for="range-volume">Volume:</label>'))
      .append(createRow(inputVolume))
      .append(createRow('<label for="sel-sound">Sound:</label>'))
      .append(createRow(inputSound));
    return {rootElement, inputVolume, inputSound};
  }

  _createSessionDurationSectionDOM() {
    const idInputWorkDuration = 'input-work-duration';
    const idInputBreakDuration = 'input-break-duration';

    const inputWorkDuration = new SpinButtonComponent(
      null,
      0,
      60,
      {
        onValueChanged: (value) =>
          (this._currentOptions.sessionDuration.work = value),
      },
      {
        id: idInputWorkDuration,
      }
    );
    const inputBreakDuration = new SpinButtonComponent(
      null,
      0,
      60,
      {
        onValueChanged: (value) =>
          (this._currentOptions.sessionDuration.break = value),
      },
      {
        id: idInputBreakDuration,
      }
    );

    const rootElement = $('<section></section>').append(
      createTitleRow(
        $(
          '<h3>Sessions duration<span class="text-muted">(in minutes)</span>:</h3>'
        )
      ),
      createRow($(`<label for="${idInputWorkDuration}">Work:</label>`)),
      createRow(inputWorkDuration.rootElement),
      createRow($(`<label for="${idInputBreakDuration}">Break:</label>`)),
      createRow(inputBreakDuration.rootElement)
    );
    return {rootElement, inputWorkDuration, inputBreakDuration};
  }

  _createFooterDOM({onSave}) {
    const buttonReset = $(`
      <button id="btn-reset-options" class="btn btn-secondary">
      Reset
      </button>
    `);
    const buttonSave = $(`
      <button id="btn-save" class="btn btn-success" data-dismiss="modal">
      Save
      </button>
    `);
    onSave && buttonSave.click(() => onSave(this._currentOptions));

    return [buttonReset, buttonSave];
  }

  _onInputVolumeChanged() {
    this._currentOptions.alarm.volume =
      parseFloat(this._inputVolume.val()) / 100;
  }

  _onInputSoundChanged() {
    this._currentOptions.alarm.sound = parseInt(this._inputSound.val());
  }
}
