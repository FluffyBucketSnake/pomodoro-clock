import {jest} from '@jest/globals';
import {Clock} from './clock.mjs';

afterEach(() => {
  jest.useRealTimers();
});

test('Clock should call function only once after one second', () => {
  jest.useFakeTimers();
  const callback = jest.fn();
  const clock = new Clock(callback);

  clock.start();

  expect(callback).not.toBeCalled();

  jest.advanceTimersByTime(1000);

  expect(callback).toHaveBeenCalledTimes(1);
});

test('Clock should reset its timer when the method reset is called', () => {
  jest.useFakeTimers();
  const callback = jest.fn();
  const clock = new Clock(callback);

  clock.start();
  jest.advanceTimersByTime(500);
  clock.reset();
  jest.advanceTimersByTime(500);

  expect(callback).not.toBeCalled();

  jest.advanceTimersByTime(1000);

  expect(callback).toHaveBeenCalledTimes(1);
});

test('Clock should pause its timer when the method pause is called', () => {
  jest.useFakeTimers();
  const callback = jest.fn();
  const clock = new Clock(callback);

  clock.start();
  jest.advanceTimersByTime(500);
  clock.pause();
  jest.advanceTimersByTime(500);

  expect(callback).not.toBeCalled();

  clock.resume();
  jest.advanceTimersByTime(500);

  expect(callback).toHaveBeenCalledTimes(1);
});
