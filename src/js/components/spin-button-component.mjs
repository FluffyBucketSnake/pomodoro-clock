import $ from 'jquery';

function clamp(value, min, max) {
  min != undefined && (value = Math.max(value, min));
  max != undefined && (value = Math.min(value, max));
  return value;
}

export class SpinButtonComponent {
  constructor(value, min, max, events = {}) {
    this._min = min;
    this._max = max;
    events && ({onValueChanged: this.onValueChanged} = events);
    ({rootElement: this._rootElement, inputBox: this._inputBox} =
      this._createDOM());
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

  _createDOM() {
    const decreaseButton = $(
      '<button class="btn btn-outline-secondary">-</button>'
    );
    decreaseButton.click(() => this._onDecreaseClick());

    const inputBox = $(
      '<input type="number" class="form-control text-center"/>'
    );
    inputBox.change(() => this._onInputBoxChanged());

    const increaseButton = $(
      '<button class="btn btn-outline-secondary">+</button>'
    );
    increaseButton.click(() => this._onIncreaseClick());

    const prependGroup = $('<div class="input-group-prepend"></div>');
    prependGroup.append(decreaseButton);
    const appendGroup = $('<div class="input-group-append"></div>');
    appendGroup.append(increaseButton);

    const rootElement = $('<div class="input-group"></div>');
    rootElement.append(prependGroup);
    rootElement.append(inputBox);
    rootElement.append(appendGroup);

    return {rootElement, decreaseButton, inputBox, increaseButton};
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
