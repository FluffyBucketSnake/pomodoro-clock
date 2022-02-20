import {jest} from '@jest/globals';
import {Clock} from './clock.mjs';
import {toMillisecs} from './time.mjs';

afterEach(() => {
  jest.useRealTimers();
});

beforeEach(() => {
  jest.useFakeTimers();
});
describe('presuming no browser lag', () => {
  it('should not tick until start', () => {
    const tick = jest.fn();
    const clock = new Clock(tick);

    jest.advanceTimersByTime(toMillisecs(1));

    expect(clock.isRunning).toBe(false);
    expect(tick).not.toHaveBeenCalled();
  });

  it('should tick every second after start', () => {
    const duration = 30;
    const tick = jest.fn();
    const clock = new Clock(tick);

    clock.start();

    for (let t = 1; t <= duration; t++) {
      jest.advanceTimersByTime(toMillisecs(1));

      expect(clock.isRunning).toBe(true);
      expect(tick).toHaveBeenCalledTimes(t);
    }
  });

  it('should not tick after stop', () => {
    const tick = jest.fn();
    const clock = new Clock(tick);

    clock.start();
    clock.stop();
    jest.advanceTimersByTime(toMillisecs(1));

    expect(clock.isRunning).toBe(false);
    expect(tick).not.toHaveBeenCalled();
  });
});
