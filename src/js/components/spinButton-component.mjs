import $ from 'jquery';

export class SpinButtonComponent {
  constructor(value, min, max) {
    ({rootElement: this._rootElement, inputBox: this._inputBox} =
      this._createDOM());
    this.value = value;
  }

  get value() {
    return this._value;
  }

  set value(value) {
    this._value = value;
    this._inputBox.val(value);
  }

  get rootElement() {
    return this._rootElement;
  }

  _createDOM() {
    const decreaseButton = $(
      '<div class="input-group-prepend"><button class="btn btn-outline-secondary">-</button></div>'
    );
    const inputBox = $(
      '<input type="number" class="form-control text-center"/>'
    );
    inputBox.change(() => this._onInputBoxChanged());
    const increaseButton = $(
      '<div class="input-group-append"><button class="btn btn-outline-secondary">+</button></div>'
    );
    const rootElement = $('<div class="input-group"></div>');
    rootElement.append(decreaseButton);
    rootElement.append(inputBox);
    rootElement.append(increaseButton);

    return {rootElement, inputBox};
  }

  _onInputBoxChanged() {
    this._value = parseFloat(this._inputBox.val());
  }
}
