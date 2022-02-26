import '@testing-library/jest-dom';
import {jest} from '@jest/globals';
import {screen, fireEvent} from '@testing-library/dom';
import $ from 'jquery';

import {SpinButtonComponent} from './spinButton-component.mjs';

it('should have an increase and a decrease button and a value input', () => {
  const spinButton = new SpinButtonComponent(3, 0, 10);
  $(document.body).append(spinButton.rootElement);

  expect(spinButton.value).toBe(3);
  expect(screen.getByRole('button', {name: '-'})).toBeVisible();
  expect(screen.getByDisplayValue('3')).toBeVisible();
  expect(screen.getByRole('button', {name: '+'})).toBeVisible();
});

it('should return correct value after user inputs on text box', () => {
  const spinButton = new SpinButtonComponent(0, 0, 10);
  $(document.body).append(spinButton.rootElement);

  fireEvent.change(screen.getByDisplayValue('0'), {target: {value: 5}});

  expect(screen.getByDisplayValue('5')).toBeVisible();
  expect(spinButton.value).toBe(5);
});
