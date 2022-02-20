import {jest} from '@jest/globals';
import {ClockStates, Clock} from './clock.mjs';

afterEach(() => {
  jest.useRealTimers();
});

it('should call function only once after each second', () => {
  jest.useFakeTimers();
  const callback = jest.fn();
  const clock = new Clock(callback);

  clock.run();

  expect(clock.state).toBe(ClockStates.Running);
  expect(clock.isRunning).toBe(true);
  expect(callback).not.toBeCalled();

  for (let i = 1; i < 30; i++) {
    jest.advanceTimersByTime(1000);

    expect(callback).toHaveBeenCalledTimes(i);
  }
});

it('should not tick after stop', () => {
  jest.useFakeTimers();
  const callback = jest.fn();
  const clock = new Clock(callback);

  clock.run();
  clock.stop();
  jest.advanceTimersByTime(1000);

  expect(clock.state).toBe(ClockStates.Stopped);
  expect(clock.isStopped).toBe(true);
  expect(clock.isRunning).toBe(false);
});

it('should reset its timer when the method reset is called', () => {
  jest.useFakeTimers();
  const callback = jest.fn();
  const clock = new Clock(callback);

  clock.run();
  jest.advanceTimersByTime(500);
  clock.reset();
  jest.advanceTimersByTime(500);

  expect(callback).not.toBeCalled();

  jest.advanceTimersByTime(1000);

  expect(callback).toHaveBeenCalledTimes(1);
});

it('should pause its timer when the method pause is called', () => {
  jest.useFakeTimers();
  const callback = jest.fn();
  const clock = new Clock(callback);

  clock.run();
  jest.advanceTimersByTime(500);
  clock.pause();
  jest.advanceTimersByTime(500);

  expect(callback).not.toBeCalled();

  clock.resume();
  jest.advanceTimersByTime(500);

  expect(callback).toHaveBeenCalledTimes(1);
});

it('should compensate for interval and timeout inaccuracy', () => {
  jest.useFakeTimers();
  const callback = jest.fn();
  let trueTime = 0;
  Date.now = jest.fn(() => trueTime);
  const clock = new Clock(callback);

  clock.run();
  trueTime = 4 * 1000;
  jest.advanceTimersByTime(1000);

  expect(callback).toHaveBeenCalledTimes(4);
});

it('should not tick if it is not running', () => {
  jest.useFakeTimers();
  const callback = jest.fn();
  const clock = new Clock(callback);

  clock.reset();
  jest.advanceTimersByTime(1000);

  expect(callback).not.toBeCalled();
});
