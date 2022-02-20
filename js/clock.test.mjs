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
