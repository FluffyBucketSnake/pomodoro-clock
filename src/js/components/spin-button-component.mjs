import $ from 'jquery';

function clamp(value, min, max) {
  min != undefined && (value = Math.max(value, min));
  max != undefined && (value = Math.min(value, max));
  return value;
}

function createInputBox(type, value, id, onChanged) {
  const inputBox = $(
    `<input type="${type}" class="form-control text-center"/>`
  ).val(value);
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
  constructor({min, max, ...props}, value) {
    this._min = min;
    this._max = max;
    this._value = clamp(value, this._min, this._max);
    ({onValueChange: this._onValueChange} = props);
    ({rootElement: this._rootElement, inputBox: this._inputBox} =
      this._createDOM(props));
  }

  get value() {
    return this._value;
  }

  set value(value) {
    const oldValue = this._value;
    value = clamp(value, this._min, this._max);
    this._value = value;
    this._inputBox.val(value);
    oldValue !== undefined && this._onValueChange && this._onValueChange(value);
  }

  get rootElement() {
    return this._rootElement;
  }

  _createDOM({id, classes = []}) {
    const inputBox = createInputBox('number', this.value, id, () =>
      this._onInputBoxChanged()
    );
    const rootElement = $(
      `<div class="${['input-group', ...classes].join(' ')}"></div>`
    ).append(
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
