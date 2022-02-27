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
  constructor() {
    ({rootElement: this._rootElement} = this._createDOM());
  }

  get rootElement() {
    return this._rootElement;
  }

  show() {
    this._rootElement.modal();
  }

  _createDOM() {
    const body = this._createBodyDOM();
    const footer = this._createFooterDOM();
    const rootElement = createModal('Options', body, footer);

    return {rootElement};
  }

  _createBodyDOM() {
    const alarmSection = this._createAlarmSectionDOM();
    const sessionDurationSection = this._createSessionDurationSectionDOM();
    const container = $('<div class="container-fluid"></div>').append(
      alarmSection,
      sessionDurationSection
    );
    return container;
  }

  _createAlarmSectionDOM() {
    return $(`
      <section>
        <div class="row justify-content-center mb-3">
              <h3>Alarm:</h3>
        </div>
        <div class="row justify-content-center">
            <label for="range-volume">Volume:</label>
        </div>
        <div class="row mb-1">
            <div class="input-group">
            <input
                type="range"
                name="volume"
                id="range-volume"
                class="mx-0 w-100"
                min="0"
                value="100"
                max="100"
            />
            </div>
        </div>
        <div class="row justify-content-center">
            <label for="sel-sound">Sound:</label>
        </div>
        <div class="row mb-5">
            <div class="input-group">
            <select name="sel-sound" id="sel-sound" class="custom-select">
                <option value="default">Default</option>
                <option value="geese">Geese</option>
                <option value="hugebell">Huge bell</option>
                <option value="police">Police siren</option>
                <option value="railroad">Railroad Crossing</option>
                <option value="rooster">Rooster</option>
                <option value="warningsiren">Warning siren</option>
                <option value="whistling">Whistling</option>
            </select>
            <div class="input-group-append">
                <a class="btn btn-outline-secondary">Listen</a>
            </div>
            </div>
        </div>
      <section>
    `);
  }

  _createSessionDurationSectionDOM() {
    const txtWorkDurationId = 'txt-work-duration';
    const txtBreakDurationId = 'txt-work-duration';

    const txtWorkDuration = new SpinButtonComponent(5, 0, 60, undefined, {
      id: txtWorkDurationId,
    });
    const txtBreakDuration = new SpinButtonComponent(5, 0, 60, undefined, {
      id: txtBreakDurationId,
    });

    const sectionContainer = $('<section></section>').append(
      createTitleRow(
        $(
          '<h3>Sessions duration<span class="text-muted">(in minutes)</span>:</h3>'
        )
      ),
      createRow($(`<label for="${txtWorkDurationId}">Work:</label>`)),
      createRow(txtWorkDuration.rootElement),
      createRow($(`<label for="${txtBreakDurationId}">Break:</label>`)),
      createRow(txtBreakDuration.rootElement)
    );
    return sectionContainer;
  }

  _createFooterDOM() {
    return $(`
      <button id="btn-reset-options" class="btn btn-secondary">
      Reset
      </button>
      <button id="btn-save" class="btn btn-success" data-dismiss="modal">
      Save
      </button>
    `);
  }
}
