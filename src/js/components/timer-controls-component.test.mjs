import '@testing-library/jest-dom';
import {jest} from '@jest/globals';
import {screen} from '@testing-library/dom';
import $ from 'jquery';

import {TimerControlsComponent} from './timer-controls-component.mjs';
import {TimerState} from '../timer.mjs';

beforeEach(() => {
  $(document.body).empty();
});

test.each([
  {
    state: TimerState.Stopped,
    prettyState: 'stopped',
    visibleButtons: ['Start', 'Options'],
  },
  {
    state: TimerState.Running,
    prettyState: 'running',
    visibleButtons: ['Stop', 'Pause', 'Reset'],
  },
  {
    state: TimerState.Paused,
    prettyState: 'paused',
    visibleButtons: ['Stop', 'Resume', 'Reset'],
  },
])('$prettyState state', ({state, visibleButtons}) => {
  const timerControlsComponent = new TimerControlsComponent();
  timerControlsComponent.timerState = state;
  $(document.body).append(timerControlsComponent.rootElement);

  const allAvailableButtons = screen.getAllByRole('button');

  expect(allAvailableButtons.map((el) => el.textContent)).toEqual(
    visibleButtons
  );
  allAvailableButtons.forEach((el) => expect(el).toBeVisible());
});

test('should call only onStart if start button was clicked while stopped', () => {
  const callbacks = {
    onStart: jest.fn(),
    onStop: jest.fn(),
    onShowOptions: jest.fn(),
    onPause: jest.fn(),
    onResume: jest.fn(),
    onReset: jest.fn(),
  };
  const timerControlsComponent = new TimerControlsComponent(callbacks);
  $(document.body).append(timerControlsComponent.rootElement);

  $(screen.getByRole('button', {name: 'Start'})).click();

  expect(callbacks.onStart).toBeCalled();
  expect(callbacks.onStop).not.toBeCalled();
  expect(callbacks.onShowOptions).not.toBeCalled();
  expect(callbacks.onPause).not.toBeCalled();
  expect(callbacks.onResume).not.toBeCalled();
  expect(callbacks.onReset).not.toBeCalled();
});
