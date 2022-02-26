import '@testing-library/jest-dom';
import {jest} from '@jest/globals';
import {screen, fireEvent} from '@testing-library/dom';
import $ from 'jquery';

import {SpinButtonComponent} from './spinButton-component.mjs';

beforeEach(() => {
  $(document.body).empty();
});

it('should have an increase and a decrease button and a value input', () => {
  const spinButton = new SpinButtonComponent(3, 0, 10);
  $(document.body).append(spinButton.rootElement);

  expect(spinButton.value).toBe(3);
  expect(screen.getByRole('button', {name: '-'})).toBeVisible();
  expect(screen.getByDisplayValue('3')).toBeVisible();
  expect(screen.getByRole('button', {name: '+'})).toBeVisible();
});

it('should return correct value after user inputs on text box', () => {
  const callbacks = {
    onValueChanged: jest.fn(),
  };
  const spinButton = new SpinButtonComponent(0, 0, 10, callbacks);
  $(document.body).append(spinButton.rootElement);

  fireEvent.change(screen.getByDisplayValue('0'), {target: {value: 5}});

  expect(screen.getByDisplayValue('5')).toBeVisible();
  expect(callbacks.onValueChanged).toBeCalledTimes(1);
  expect(spinButton.value).toBe(5);
});

it('should increase value when user clicks the increment button', () => {
  const callbacks = {
    onValueChanged: jest.fn(),
  };
  const spinButton = new SpinButtonComponent(0, 0, 10, callbacks);
  $(document.body).append(spinButton.rootElement);

  fireEvent.click(screen.getByRole('button', {name: '+'}));

  expect(screen.getByDisplayValue('1')).toBeVisible();
  expect(callbacks.onValueChanged).toBeCalledTimes(1);
  expect(spinButton.value).toBe(1);
});

it('should decrease value when user clicks the decrement button', () => {
  const callbacks = {
    onValueChanged: jest.fn(),
  };
  const spinButton = new SpinButtonComponent(1, 0, 10, callbacks);
  $(document.body).append(spinButton.rootElement);

  fireEvent.click(screen.getByRole('button', {name: '-'}));

  expect(screen.getByDisplayValue('0')).toBeVisible();
  expect(callbacks.onValueChanged).toBeCalledTimes(1);
  expect(spinButton.value).toBe(0);
});
