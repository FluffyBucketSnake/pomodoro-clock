import 'bootstrap';
import {$$, toOptions} from '../ui.mjs';
import $ from 'jquery';
import {SpinButtonComponent} from '../components/spin-button-component.mjs';

const createSection = (title, content, isEnd = false) =>
  $$('section', !isEnd ? 'mb-5' : '').append(createTitleRow(title), content);

const createTitleRow = (title) =>
  $$('div', 'row justify-content-center').append(
    $$('h3', [], {content: title})
  );

const createRow = (content) =>
  $$('div', 'row justify-content-center align-items-baseline').append(content);

function createLabelRow(id, text, content) {
  return createRow([
    `<label class="col-4 my-3" for="${id}">${text}:</label>`,
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
  const modal = $$('div', 'modal', {tabindex: -1}).append(
    $$('div', 'modal-dialog').append(
      $$('div', 'modal-content').append(
        createModalHeader(title),
        $$('div', 'modal-body').append(body),
        $$('div', 'modal-footer').append(footer)
      )
    )
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
    const rootElement = $$('div', 'container-fluid').append(
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
    const inputVolume = $$('input', 'col', {
      type: 'range',
      name: 'volume',
      id: 'range-volume',
      class: 'col',
      min: '0',
      max: '100',
    }).change(() => this._onInputVolumeChanged());

    const soundOptions = toOptions(sounds.map(({id, name}) => [id, name]));
    const inputSound = $$('select', 'col custom-select', {
      id: 'sel-sound',
      name: 'sel-sound',
    })
      .append(soundOptions)
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

    const inputHasLongBreak = $$('input', 'custom-control-input', {
      id: idInputHasLongBreak,
      type: 'checkbox',
    }).change(() => this._onInputHasLongBreakChanged());
    const inputHasLongBreakContainer = $$(
      'div',
      'col custom-control custom-switch'
    ).append(
      inputHasLongBreak,
      $$('label', 'custom-control-label', {for: idInputHasLongBreak})
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
        createLabelRow(
          idInputHasLongBreak,
          'Long break',
          inputHasLongBreakContainer
        ),
        createRow(
          $$('span', 'text-muted', {
            content: 'All durations are measured in minutes',
          })
        ),
        createLabelRow(
          idInputWorkDuration,
          'Work duration',
          inputWorkDuration.rootElement
        ),
        createLabelRow(
          idInputBreakDuration,
          'Break duration',
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
    const buttonReset = $$('button', 'btn btn-secondary', {
      id: 'btn-reset-options',
      content: 'Reset',
    });
    onReset && buttonReset.click(() => (this.currentOptions = onReset()));
    const buttonSave = $$('button', 'btn btn-success', {
      'data-dismiss': 'modal',
      content: 'Save',
    });
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
