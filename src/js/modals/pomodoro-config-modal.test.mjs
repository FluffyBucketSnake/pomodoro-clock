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
    {id: '0', name: 'a', url: 'a'},
    {id: '1', name: 'b', url: 'b'},
    {id: '2', name: 'c', url: 'c'},
    {id: '3', name: 'd', url: 'd'},
    {id: '4', name: 'e', url: 'e'},
  ],
};

const DefaultOptions = {
  alarm: {
    volume: 0.4,
    sound: {id: '2', name: 'c', url: 'c'},
  },
  session: {
    hasLongBreak: false,
    workDuration: 25,
    breakDuration: 5,
  },
};

const DesiredOptions = {
  alarm: {
    volume: 1,
    sound: {id: '0', name: 'a', url: 'a'},
  },
  session: {
    hasLongBreak: true,
    workDuration: 30,
    breakDuration: 1,
  },
};

it.each([DefaultOptions, DesiredOptions])(
  'should show all options and configurations when shown',
  (options) => {
    const modal = new PomodoroConfigModal(DefaultProps, options);
    $(document.body).append(modal.rootElement);

    modal.show();

    expect(screen.getByRole('heading', {name: 'Options'})).toBeVisible();

    expect(screen.getByRole('heading', {name: 'Alarm'})).toBeVisible();
    const inputAlarmVolume = screen.getByLabelText('Volume:');
    expect(inputAlarmVolume).toBeVisible();
    expect(inputAlarmVolume).toHaveValue(`${options.alarm.volume * 100}`);
    const inputAlarmSound = screen.getByLabelText('Sound:');
    expect(inputAlarmSound).toBeVisible();
    expect(inputAlarmSound).toHaveValue(options.alarm.sound.id);
    expect(inputAlarmSound.options[inputAlarmSound.selectedIndex].text).toBe(
      options.alarm.sound.name
    );

    expect(screen.getByRole('heading', {name: 'Session'})).toBeVisible();
    const inputHasLongBreak = screen.getByLabelText('Long break:');
    expect(inputHasLongBreak).toBeVisible();
    if (options.session.hasLongBreak) {
      expect(inputHasLongBreak).toBeChecked();
    } else {
      expect(inputHasLongBreak).not.toBeChecked();
    }
    const inputWorkDuration = screen.getByLabelText('Work dur.:');
    expect(inputWorkDuration).toBeVisible();
    expect(inputWorkDuration).toHaveValue(options.session.workDuration);
    const inputBreakDuration = screen.getByLabelText('Break dur.:');
    expect(inputBreakDuration).toBeVisible();
    expect(inputBreakDuration).toHaveValue(options.session.breakDuration);
  }
);

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
  const onSave = jest.fn((value) => value);
  const modal = new PomodoroConfigModal(
    {onSave, ...DefaultProps},
    DefaultOptions
  );
  $(document.body).append(modal.rootElement);
  modal.show();

  fireUserChanges(DesiredOptions);
  fireEvent.click(screen.getByRole('button', {name: 'Save'}));

  expect(onSave).toBeCalled();
  expect(onSave).toReturnWith(modal.currentOptions);
  expect(modal.currentOptions).toStrictEqual(DesiredOptions);
});

it('should call onReset when user clicks on the Reset button, resetting the options with the value provided by the function', () => {
  const onReset = jest.fn(() => DefaultOptions);
  const modal = new PomodoroConfigModal(
    {onReset, ...DefaultProps},
    DefaultOptions
  );
  $(document.body).append(modal.rootElement);
  modal.show();

  fireUserChanges(DesiredOptions);
  fireEvent.click(screen.getByRole('button', {name: 'Reset'}));

  expect(onReset).toBeCalled();
  expect(modal.currentOptions).toStrictEqual(DefaultOptions);
});

function fireUserChanges(desiredOptions) {
  fireEvent.change(screen.getByLabelText('Volume:'), {
    target: {value: desiredOptions.alarm.volume * 100},
  });
  fireEvent.change(screen.getByLabelText('Sound:'), {
    target: {value: desiredOptions.alarm.sound.id},
  });
  fireEvent.change(screen.getByLabelText('Long break:'), {
    target: {checked: desiredOptions.session.hasLongBreak},
  });
  fireEvent.change(screen.getByLabelText('Work dur.:'), {
    target: {value: desiredOptions.session.workDuration},
  });
  fireEvent.change(screen.getByLabelText('Break dur.:'), {
    target: {value: desiredOptions.session.breakDuration},
  });
}
