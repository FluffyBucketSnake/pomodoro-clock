import '@testing-library/jest-dom';
import {jest} from '@jest/globals';
import {screen} from '@testing-library/dom';
import $ from 'jquery';

import {PomodoroConfigModal} from './pomodoro-config-modal.mjs';

beforeEach(() => {
  $(document.body).empty();
});

const DefaultProps = {
  alarmSounds: [
    {name: 'a', url: 'a'},
    {name: 'b', url: 'b'},
    {name: 'c', url: 'c'},
    {name: 'd', url: 'd'},
    {name: 'e', url: 'e'},
  ],
};

const DefaultOptions = {
    alarm: {
      volume: 0.4,
      sound: 2,
    },
    sessionDuration: {
      work: 25,
      break: 5,
    },
  };

it('should show all options and configurations when shown', () => {
  const modal = new PomodoroConfigModal(DefaultProps, DefaultOptions);
  $(document.body).append(modal.rootElement);

  modal.show();

  expect(screen.getByRole('heading', {name: 'Options'})).toBeVisible();

  expect(screen.getByRole('heading', {name: 'Alarm:'})).toBeVisible();
  const inputRange = screen.getByLabelText('Volume:');
  expect(inputRange).toBeVisible();
  expect(inputRange.value).toBe('40');
  const inputSound = screen.getByLabelText('Sound:');
  expect(inputSound).toBeVisible();
  expect(inputSound.value).toBe('2');
  expect(inputSound.options[inputSound.selectedIndex].text).toBe(
    ExampleAlarmSounds[inputSound.selectedIndex].name
  );

  expect(
    screen.getByRole('heading', {name: 'Sessions duration (in minutes) :'})
  ).toBeVisible();
  const inputWorkDuration = screen.getByLabelText('Work:');
  expect(inputWorkDuration).toBeVisible();
  expect(inputWorkDuration.value).toBe('25');
  const inputBreakDuration = screen.getByLabelText('Break:');
  expect(inputBreakDuration).toBeVisible();
  expect(inputBreakDuration.value).toBe('5');
});

it('should show all submitted alarm options', () => {
  const modal = new PomodoroConfigModal(DefaultProps, DefaultOptions);
  $(document.body).append(modal.rootElement);

  modal.show();

  for (const [index, {name}] of ExampleAlarmSounds.entries()) {
    const option = screen.getByRole('option', {name});
    expect(option).toBeVisible();
    expect(option.value).toBe(String(index));
  }
});
