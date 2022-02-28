import {$$} from '../ui.mjs';

function clamp(value, min, max) {
  min != undefined && (value = Math.max(value, min));
  max != undefined && (value = Math.min(value, max));
  return value;
}

const createInputBox = (type, value, id, onChanged) =>
  $$('input', 'form-control text-center', {id, type})
    .val(value)
    .change(onChanged);

const createGroupButton = (type, text, onClick) =>
  $$('div', `input-group-${type}`).append(
    $$('button', 'btn btn-outline-secondary').append(text).click(onClick)
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
    const rootElement = $$('div', ['input-group', ...classes]).append(
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
