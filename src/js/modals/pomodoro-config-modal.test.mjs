import '@testing-library/jest-dom';
import {jest} from '@jest/globals';
import {screen} from '@testing-library/dom';
import $ from 'jquery';

import {PomodoroConfigModal} from './pomodoro-config-modal.mjs';

beforeEach(() => {
  $(document.body).empty();
});

it('should have a alarm session, with sound and volume options and time session with duration options when shown.', () => {
  const modal = new PomodoroConfigModal();
  $(document.body).append(modal.rootElement);

  modal.show();

  expect(screen.getByRole('heading', {name: 'Options'})).toBeVisible();

  expect(screen.getByRole('heading', {name: 'Alarm:'})).toBeVisible();
  expect(screen.getByLabelText('Volume:')).toBeVisible();
  expect(screen.getByLabelText('Sound:')).toBeVisible();

  expect(
    screen.getByRole('heading', {name: 'Sessions duration (in minutes) :'})
  ).toBeVisible();
  expect(screen.getByLabelText('Work:')).toBeVisible();
  expect(screen.getByLabelText('Break:')).toBeVisible();
});

it('should show all submitted alarm options', () => {
  const alarmSounds = ['a', 'b', 'c', 'd'];
  const modal = new PomodoroConfigModal({alarmSounds});
  $(document.body).append(modal.rootElement);

  modal.show();

  for (const [index, name] of alarmSounds.entries()) {
    const option = screen.getByRole('option', {name});
    expect(option).toBeVisible();
    expect(option.value).toBe(String(index));
  }
});
