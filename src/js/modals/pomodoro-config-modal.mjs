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
    `<label class="col-3 my-2" for="${id}">${text}:</label>`,
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
    this._inputSound.val(value.alarm.sound.id);
    this._inputWorkDuration.value = value.session.workDuration;
    this._inputBreakDuration.value = value.session.breakDuration;
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
      rootElement: sessionSection,
      inputWorkDuration,
      inputBreakDuration,
    } = this._createSessionSectionDOM();
    const rootElement = $('<div class="container-fluid"></div>').append(
      alarmSection,
      sessionSection
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
    const idInputWorkDuration = 'input-work-duration';
    const idInputBreakDuration = 'input-break-duration';

    const inputHasLongBreak = $('<button id="input-long-break">Burg</button>');
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

    const rootElement = createSection(
      'Session',
      [
        createRow(
          '<span class="text-muted mb-2">All durations are measured in minutes.</span>'
        ),
        createLabelRow('input-long-break', 'Long break', inputHasLongBreak),
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
      ],
      true
    );
    return {rootElement, inputWorkDuration, inputBreakDuration};
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
}
