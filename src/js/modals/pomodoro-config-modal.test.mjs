import '@testing-library/jest-dom';
import {jest} from '@jest/globals';
import {fireEvent, screen} from '@testing-library/dom';
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
    DefaultProps.alarmSounds[inputSound.selectedIndex].name
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

  for (const [index, {name}] of DefaultProps.alarmSounds.entries()) {
    const option = screen.getByRole('option', {name});
    expect(option).toBeVisible();
    expect(option.value).toBe(String(index));
  }
});

it('should call onSave when user clicks on Save button, returning the current options', () => {
  const desiredOptions = {
    alarm: {
      volume: 1,
      sound: 0,
    },
    sessionDuration: {
      work: 30,
      break: 1,
    },
  };
  const onSave = jest.fn((value) => value);
  const modal = new PomodoroConfigModal(
    {onSave, ...DefaultProps},
    DefaultOptions
  );
  $(document.body).append(modal.rootElement);
  modal.show();

  fireEvent.change(screen.getByLabelText('Volume:'), {
    target: {value: desiredOptions.alarm.volume * 100},
  });
  fireEvent.change(screen.getByLabelText('Sound:'), {
    target: {value: desiredOptions.alarm.sound},
  });
  fireEvent.change(screen.getByLabelText('Work:'), {
    target: {value: desiredOptions.sessionDuration.work},
  });
  fireEvent.change(screen.getByLabelText('Break:'), {
    target: {value: desiredOptions.sessionDuration.break},
  });
  fireEvent.click(screen.getByRole('button', {name: 'Save'}));

  expect(onSave).toBeCalled();
  expect(onSave).toReturnWith(modal.currentOptions);
  expect(modal.currentOptions).toStrictEqual(desiredOptions);
});
