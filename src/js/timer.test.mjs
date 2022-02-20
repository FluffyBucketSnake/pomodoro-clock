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

it('should start when the run method is called', () => {
  const duration = toMillisecs(25);
  const elapsedTime = toMillisecs(20);
  const onRing = jest.fn();
  const timer = new Timer(duration, onRing);

  timer.run();
  jest.advanceTimersByTime(elapsedTime);

  expect(timer.state).toBe(TimerState.Running);
  expect(timer.isStopped).toBe(false);
  expect(timer.isRunning).toBe(true);
  expect(timer.isPaused).toBe(false);
  expect(timer.elapsedTime).toBe(elapsedTime);
  expect(timer.remainingTime).toBe(duration - elapsedTime);
  expect(onRing).not.toHaveBeenCalled();
});

it('should ring when it elapses its duration', () => {
  const duration = toMillisecs(25);
  const onRing = jest.fn();
  const timer = new Timer(duration, onRing);

  timer.run();
  jest.advanceTimersByTime(duration);

  expect(timer.state).toBe(TimerState.Stopped);
  expect(timer.isStopped).toBe(true);
  expect(timer.isRunning).toBe(false);
  expect(timer.isPaused).toBe(false);
  expect(timer.elapsedTime).toBe(duration);
  expect(timer.remainingTime).toBe(0);
  expect(onRing).toHaveBeenCalled();
});
