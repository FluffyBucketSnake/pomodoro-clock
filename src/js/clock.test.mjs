import {jest} from '@jest/globals';
import {ClockStates, Clock} from './clock.mjs';
import {toMillisecs, toSecs} from './time.mjs';

afterEach(() => {
  jest.useRealTimers();
});

it('should call function only once after each second', () => {
  jest.useFakeTimers();
  const callback = jest.fn((ellapsedTime) => toSecs(ellapsedTime));
  const clock = new Clock(callback);

  clock.run();

  expect(clock.state).toBe(ClockStates.Running);
  expect(clock.isRunning).toBe(true);
  expect(clock.ellapsedTime).toBe(0);
  expect(callback).not.toBeCalled();

  for (let i = 1; i < 30; i++) {
    jest.advanceTimersByTime(toMillisecs(1));

    expect(clock.ellapsedTime).toBe(toMillisecs(1));
    expect(callback).toHaveBeenCalledTimes(i);
    expect(callback).toHaveLastReturnedWith(i);
  }
});

it('should not tick after stop', () => {
  jest.useFakeTimers();
  const callback = jest.fn();
  const clock = new Clock(callback);

  clock.run();
  clock.stop();
  jest.advanceTimersByTime(toMillisecs(1));

  expect(clock.state).toBe(ClockStates.Stopped);
  expect(clock.isStopped).toBe(true);
  expect(clock.isRunning).toBe(false);
  expect(clock.ellapsedTime).toBe(0);
});

it('should reset its timer when the method reset is called', () => {
  jest.useFakeTimers();
  const callback = jest.fn();
  const clock = new Clock(callback);

  clock.run();
  jest.advanceTimersByTime(toMillisecs(0.5));
  clock.reset();
  jest.advanceTimersByTime(toMillisecs(0.5));

  expect(clock.ellapsedTime).toBe(toMillisecs(0.5));
  expect(callback).not.toBeCalled();

  jest.advanceTimersByTime(toMillisecs(0.5));

  expect(clock.ellapsedTime).toBe(toMillisecs(1));
  expect(callback).toHaveBeenCalledTimes(1);
});

it('should pause its timer when the method pause is called', () => {
  jest.useFakeTimers();
  const callback = jest.fn();
  const clock = new Clock(callback);

  clock.run();
  jest.advanceTimersByTime(toMillisecs(0.5));
  clock.pause();
  jest.advanceTimersByTime(toMillisecs(0.5));

  expect(clock.state).toBe(ClockStates.Paused);
  expect(clock.isRunning).toBe(false);
  expect(clock.isStopped).toBe(false);
  expect(clock.isPaused).toBe(true);
  expect(clock.ellapsedTime).toBe(toMillisecs(0.5));
  expect(callback).not.toBeCalled();

  clock.run();
  jest.advanceTimersByTime(toMillisecs(0.5));

  expect(clock.ellapsedTime).toBe(toMillisecs(1.0));
  expect(callback).toHaveBeenCalledTimes(1);
});

it('should compensate for interval and timeout inaccuracy', () => {
  jest.useFakeTimers();
  const callback = jest.fn();
  let trueTime = 0;
  Date.now = jest.fn(() => trueTime);
  const clock = new Clock(callback);

  clock.run();
  trueTime = toMillisecs(4.3);
  jest.advanceTimersByTime(toMillisecs(1));

  expect(clock.ellapsedTime).toBe(toMillisecs(4.3));
  expect(callback).toHaveBeenCalledTimes(4);
});

it('should not tick if it is not running', () => {
  jest.useFakeTimers();
  const callback = jest.fn();
  const clock = new Clock(callback);

  clock.reset();
  jest.advanceTimersByTime(toMillisecs(1));

  expect(callback).not.toBeCalled();
});
