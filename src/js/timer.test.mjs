import {jest} from '@jest/globals';
import {toMillisecs} from './time.mjs';
import {Timer, TimerState} from './timer.mjs';

afterEach(() => {
  jest.useRealTimers();
});

beforeEach(() => {
  jest.useFakeTimers();
});

it('should not do anything when idle', () => {
  const onRing = jest.fn();
  const timer = new Timer(onRing);

  jest.advanceTimersByTime(toMillisecs(25));

  expect(timer.state).toBe(TimerState.Stopped);
  expect(timer.isStopped).toBe(true);
  expect(timer.isRunning).toBe(false);
  expect(timer.isPaused).toBe(false);
  expect(timer.elapsedTime).toBe(0);
  expect(onRing).not.toHaveBeenCalled();
});
