import '@testing-library/jest-dom';
import {jest} from '@jest/globals';
import {screen, fireEvent} from '@testing-library/dom';
import $ from 'jquery';

import {SpinButtonComponent} from './spin-button-component.mjs';

beforeEach(() => {
  $(document.body).empty();
});

it('should have an increase and a decrease button and a value input', () => {
  const spinButton = new SpinButtonComponent({min: 0, max: 10}, 3);
  $(document.body).append(spinButton.rootElement);

  expect(spinButton.value).toBe(3);
  expect(screen.getByRole('button', {name: '-'})).toBeVisible();
  expect(screen.getByDisplayValue('3')).toBeVisible();
  expect(screen.getByRole('button', {name: '+'})).toBeVisible();
});

it('should return correct value after user inputs on text box', () => {
  const onValueChange = jest.fn();
  const spinButton = new SpinButtonComponent(
    {min: 0, max: 10, onValueChange},
    0
  );
  $(document.body).append(spinButton.rootElement);

  fireEvent.change(screen.getByDisplayValue('0'), {target: {value: 5}});

  expect(screen.getByDisplayValue('5')).toBeVisible();
  expect(onValueChange).toBeCalledTimes(1);
  expect(spinButton.value).toBe(5);
});

it('should increase value when user clicks the increment button', () => {
  const onValueChange = jest.fn();
  const spinButton = new SpinButtonComponent(
    {min: 0, max: 10, onValueChange},
    0
  );
  $(document.body).append(spinButton.rootElement);

  fireEvent.click(screen.getByRole('button', {name: '+'}));

  expect(screen.getByDisplayValue('1')).toBeVisible();
  expect(onValueChange).toBeCalledTimes(1);
  expect(spinButton.value).toBe(1);
});

it('should decrease value when user clicks the decrement button', () => {
  const onValueChange = jest.fn();
  const spinButton = new SpinButtonComponent(
    {min: 0, max: 10, onValueChange},
    1
  );
  $(document.body).append(spinButton.rootElement);

  fireEvent.click(screen.getByRole('button', {name: '-'}));

  expect(screen.getByDisplayValue('0')).toBeVisible();
  expect(onValueChange).toBeCalledTimes(1);
  expect(spinButton.value).toBe(0);
});

it('should clamp value to maximum if it exceeds', () => {
  const spinButton = new SpinButtonComponent({min: 0, max: 10}, 5);
  $(document.body).append(spinButton.rootElement);

  spinButton.value = 15;
  fireEvent.click(screen.getByRole('button', {name: '+'}));

  expect(screen.getByDisplayValue('10')).toBeVisible();
  expect(spinButton.value).toBe(10);
});

it('should clamp value to minimum if it is below', () => {
  const spinButton = new SpinButtonComponent({min: 0, max: 10}, 5);
  $(document.body).append(spinButton.rootElement);

  spinButton.value = -5;
  fireEvent.click(screen.getByRole('button', {name: '-'}));

  expect(screen.getByDisplayValue('0')).toBeVisible();
  expect(spinButton.value).toBe(0);
});
