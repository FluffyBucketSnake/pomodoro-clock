import $ from 'jquery';
import 'bootstrap';
import {SpinButtonComponent} from '../components/spin-button-component.mjs';

const createSection = (title, content, isEnd = false) =>
  $(`<section${!isEnd ? ' class="mb-5"' : ''}></section>`).append(
    createTitleRow(title),
    content
  );

const createTitleRow = (title) =>
  $(`<div class="row mb-3"><h3>${title}</h3></div>`);

function createRow(content) {
  const container = $('<div class="row align-items-baseline"></div>');
  container.append(content);
  return container;
}

function createLabelRow(id, text, content) {
  return createRow([
    `<label class="col-3 my-3" for="${id}">${text}:</label>`,
    content,
  ]);
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
    this._alarmSounds = props.alarmSounds;
    ({
      rootElement: this._rootElement,
      inputVolume: this._inputVolume,
      inputSound: this._inputSound,
      inputHasLongBreak: this._inputHasLongBreak,
      inputWorkDuration: this._inputWorkDuration,
      inputBreakDuration: this._inputBreakDuration,
      inputLongBreakDuration: this._inputLongBreakDuration,
      rowInputLongBreakDuration: this._rowInputLongBreakDuration,
    } = this._createDOM(props, value));
    this.currentOptions = value;
  }

  get rootElement() {
    return this._rootElement;
  }

  set currentOptions(value) {
    this._currentOptions = value;
    this._inputVolume.val(value.alarm.volume * 100);
    this._inputSound.val(value.alarm.sound.id);
    this._toggleHasLongBreak(value.session.hasLongBreak);
    this._inputWorkDuration.value = value.session.workDuration;
    this._inputBreakDuration.value = value.session.breakDuration;
    this._inputLongBreakDuration.value = value.session.longBreakDuration;
  }

  get currentOptions() {
    return this._currentOptions;
  }

  show() {
    this._rootElement.modal();
  }

  _createDOM(props) {
    const {rootElement: body, ...inputs} = this._createBodyDOM(props);
    const footer = this._createFooterDOM(props);
    const rootElement = createModal('Options', body, footer);

    return {
      rootElement,
      ...inputs,
    };
  }

  _createBodyDOM({alarmSounds}) {
    const {rootElement: alarmSection, ...alarmInputs} =
      this._createAlarmSectionDOM(alarmSounds);
    const {rootElement: sessionSection, ...sessionInputs} =
      this._createSessionSectionDOM();
    const rootElement = $('<div class="container-fluid"></div>').append(
      alarmSection,
      sessionSection
    );
    return {
      rootElement,
      ...alarmInputs,
      ...sessionInputs,
    };
  }

  _createAlarmSectionDOM(sounds) {
    const inputVolume = $(`
      <input 
        type="range" 
        name="volume" 
        id="range-volume" 
        class="col"
        min="0" 
        max="100"/>`).change(() => this._onInputVolumeChanged());
    const optionsSound = sounds.map(
      ({id, name}) => `<option value="${id}"}>${name}</option>`
    );
    const inputSound = $(
      '<select name="sel-sound" id="sel-sound" class="col custom-select"></select>'
    )
      .append(optionsSound)
      .change(() => this._onInputSoundChanged());

    const rootElement = createSection('Alarm', [
      createLabelRow('range-volume', 'Volume', inputVolume),
      createLabelRow('sel-sound', 'Sound', inputSound),
    ]);
    return {rootElement, inputVolume, inputSound};
  }

  _createSessionSectionDOM() {
    const idInputHasLongBreak = 'input-has-long-break';
    const idInputWorkDuration = 'input-work-duration';
    const idInputBreakDuration = 'input-break-duration';
    const idInputLongBreakDuration = 'input-long-break-duration';

    const inputHasLongBreak = $(
      `<input type="checkbox" class="custom-control-input" id="${idInputHasLongBreak}">`
    ).change(() => this._onInputHasLongBreakChanged());
    const inputHasLongBreakContainer = $(
      '<div class="custom-control custom-switch"></div>'
    ).append(
      inputHasLongBreak,
      `<label class="custom-control-label" for="${idInputHasLongBreak}"/>`
    );
    const inputWorkDuration = new SpinButtonComponent({
      id: idInputWorkDuration,
      classes: ['col', 'px-0'],
      min: 0,
      max: 60,
      onValueChange: (value) =>
        (this._currentOptions.session.workDuration = value),
    });
    const inputBreakDuration = new SpinButtonComponent({
      id: idInputBreakDuration,
      classes: ['col', 'px-0'],
      min: 0,
      max: 60,
      onValueChange: (value) =>
        (this._currentOptions.session.breakDuration = value),
    });
    const inputLongBreakDuration = new SpinButtonComponent({
      id: idInputLongBreakDuration,
      classes: ['col', 'px-0'],
      min: 0,
      max: 60,
      onValueChange: (value) =>
        (this._currentOptions.session.longBreakDuration = value),
    });
    const rowInputLongBreakDuration = createLabelRow(
      idInputLongBreakDuration,
      'Long break dur.',
      inputLongBreakDuration.rootElement
    );

    const rootElement = createSection(
      'Session',
      [
        createRow(
          '<span class="text-muted mb-2">All durations are measured in minutes.</span>'
        ),
        createLabelRow(
          idInputHasLongBreak,
          'Long break',
          inputHasLongBreakContainer
        ),
        createLabelRow(
          idInputWorkDuration,
          'Work dur.',
          inputWorkDuration.rootElement
        ),
        createLabelRow(
          idInputBreakDuration,
          'Break dur.',
          inputBreakDuration.rootElement
        ),
        rowInputLongBreakDuration,
      ],
      true
    );
    return {
      rootElement,
      inputHasLongBreak,
      inputWorkDuration,
      inputBreakDuration,
      inputLongBreakDuration,
      rowInputLongBreakDuration,
    };
  }

  _createFooterDOM({onSave, onReset}) {
    const buttonReset = $(`
      <button id="btn-reset-options" class="btn btn-secondary">
      Reset
      </button>
    `);
    onReset && buttonReset.click(() => (this.currentOptions = onReset()));
    const buttonSave = $(`
      <button id="btn-save" class="btn btn-success" data-dismiss="modal">
      Save
      </button>
    `);
    onSave && buttonSave.click(() => onSave(this.currentOptions));

    return [buttonReset, buttonSave];
  }

  _onInputVolumeChanged() {
    this._currentOptions.alarm.volume =
      parseFloat(this._inputVolume.val()) / 100;
  }

  _onInputSoundChanged() {
    this._currentOptions.alarm.sound = this._alarmSounds.find(
      ({id}) => id === this._inputSound.val()
    );
  }

  _onInputHasLongBreakChanged() {
    this._toggleHasLongBreak(this._inputHasLongBreak[0].checked);
  }

  _toggleHasLongBreak(value) {
    this._currentOptions.session.hasLongBreak = value;
    this._inputHasLongBreak[0].checked = value;
    if (value) {
      this._rowInputLongBreakDuration.show();
    } else {
      this._rowInputLongBreakDuration.hide();
    }
  }
}
