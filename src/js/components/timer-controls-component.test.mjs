import '@testing-library/jest-dom';
import {jest} from '@jest/globals';
import {screen} from '@testing-library/dom';
import $ from 'jquery';

import {TimerControlsComponent} from './timer-controls-component.mjs';
import {TimerState} from '../timer.mjs';

test('idle state', () => {
  const timerControlsComponent = new TimerControlsComponent();
  $(document.body).append(timerControlsComponent.rootElement);

  expect(screen.getByRole('button', {name: 'Start'})).toBeVisible();
  expect(screen.getByRole('button', {name: 'Options'})).toBeVisible();
  expect(screen.queryByRole('button', {name: 'Stop'})).toBeNull();
  expect(screen.queryByRole('button', {name: 'Pause'})).toBeNull();
  expect(screen.queryByRole('button', {name: 'Resume'})).toBeNull();
  expect(screen.queryByRole('button', {name: 'Reset'})).toBeNull();
});

test('running state', () => {
  const timerControlsComponent = new TimerControlsComponent();
  timerControlsComponent.timerState = TimerState.Running;
  $(document.body).append(timerControlsComponent.rootElement);

  expect(screen.getByRole('button', {name: 'Stop'})).toBeVisible();
  expect(screen.getByRole('button', {name: 'Pause'})).toBeVisible();
  expect(screen.getByRole('button', {name: 'Reset'})).toBeVisible();
  expect(screen.queryByRole('button', {name: 'Start'})).toBeNull();
  expect(screen.queryByRole('button', {name: 'Options'})).toBeNull();
  expect(screen.queryByRole('button', {name: 'Resume'})).toBeNull();
});

test('paused state', () => {
  const timerControlsComponent = new TimerControlsComponent();
  timerControlsComponent.timerState = TimerState.Paused;
  $(document.body).append(timerControlsComponent.rootElement);

  expect(screen.getByRole('button', {name: 'Stop'})).toBeVisible();
  expect(screen.getByRole('button', {name: 'Resume'})).toBeVisible();
  expect(screen.getByRole('button', {name: 'Reset'})).toBeVisible();
  expect(screen.queryByRole('button', {name: 'Start'})).toBeNull();
  expect(screen.queryByRole('button', {name: 'Options'})).toBeNull();
  expect(screen.queryByRole('button', {name: 'Pause'})).toBeNull();
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
