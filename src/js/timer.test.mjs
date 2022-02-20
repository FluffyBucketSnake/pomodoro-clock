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
  const duration = toMillisecs(25);
  const onRing = jest.fn();
  const timer = new Timer(duration, onRing);

  jest.advanceTimersByTime(duration);

  expect(timer.state).toBe(TimerState.Stopped);
  expect(timer.isStopped).toBe(true);
  expect(timer.isRunning).toBe(false);
  expect(timer.isPaused).toBe(false);
  expect(timer.elapsedTime).toBe(0);
  expect(timer.remainingTime).toBe(duration);
  expect(onRing).not.toHaveBeenCalled();
});
