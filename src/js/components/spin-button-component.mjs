import $ from 'jquery';

function clamp(value, min, max) {
  min != undefined && (value = Math.max(value, min));
  max != undefined && (value = Math.min(value, max));
  return value;
}

function createInputBox(type, id, onChanged) {
  const inputBox = $(
    `<input type="${type}" class="form-control text-center"/>`
  );
  id && inputBox.attr('id', id);
  onChanged && inputBox.change(onChanged);
  return inputBox;
}

const createGroupButton = (type, text, onClick) =>
  $(`<div class="input-group-${type}"></div>`).append(
    $(`<button class="btn btn-outline-secondary">${text}</button>`).click(
      onClick
    )
  );

export class SpinButtonComponent {
  constructor(value, min, max, events = {}, options = {}) {
    this._min = min;
    this._max = max;
    events && ({onValueChanged: this.onValueChanged} = events);
    ({rootElement: this._rootElement, inputBox: this._inputBox} =
      this._createDOM(options));
    this.value = value;
  }

  get value() {
    return this._value;
  }

  set value(value) {
    const oldValue = this._value;
    value = clamp(value, this._min, this._max);
    this._value = value;
    this._inputBox.val(value);
    oldValue !== undefined && this.onValueChanged && this.onValueChanged(value);
  }

  get rootElement() {
    return this._rootElement;
  }

  _createDOM({id}) {
    const inputBox = createInputBox('number', id, () =>
      this._onInputBoxChanged()
    );
    const rootElement = $('<div class="input-group"></div>').append(
      createGroupButton('prepend', '-', () => this._onDecreaseClick()),
      inputBox,
      createGroupButton('append', '+', () => this._onIncreaseClick())
    );
    return {rootElement, inputBox};
  }

  _onDecreaseClick() {
    this.value--;
  }

  _onIncreaseClick() {
    this.value++;
  }

  _onInputBoxChanged() {
    this.value = parseFloat(this._inputBox.val());
  }
}
