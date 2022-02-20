import {jest} from '@jest/globals';
import {Clock} from './clock.mjs';
import {toMillisecs, toSecs} from './time.mjs';

afterEach(() => {
  jest.useRealTimers();
});

beforeEach(() => {
  jest.useFakeTimers();
});

function mockDateNow() {
  let time = 0;
  Date.now = () => time;
  const advanceDateByTime = (milliseconds) => (time += milliseconds);
  const advanceTimersToNextTimer = (realTimeElapsed) => {
    advanceDateByTime(realTimeElapsed);
    jest.advanceTimersToNextTimer();
  };
  return [advanceTimersToNextTimer, advanceDateByTime];
}

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
    jest.advanceTimersByTime(toMillisecs(1.5));
    clock.stop();
    jest.advanceTimersByTime(toMillisecs(20));

    expect(clock.isRunning).toBe(false);
    expect(tick).toHaveBeenCalledTimes(1);
  });
});

describe('presuming browser lag', () => {
  it('should pass the actual time since the last tick as parameter', () => {
    const [advanceTimersToNextTimer] = mockDateNow();
    const lag = 0.5;
    const tick = jest.fn((delta) => toSecs(delta));
    const clock = new Clock(tick);

    clock.start();

    advanceTimersToNextTimer(toMillisecs(1 + lag));

    expect(tick).toHaveReturnedWith(1 + lag);
  });

  it('should readjust tick timeout in case of lag', () => {
    const [advanceTimersToNextTimer] = mockDateNow();
    const lag = 0.5;
    const deltas = [1 + lag, 1 - lag, 1];
    const tick = jest.fn((delta) => toSecs(delta));
    const clock = new Clock(tick);

    clock.start();

    for (const delta of deltas) {
      advanceTimersToNextTimer(toMillisecs(delta));

      expect(tick).toHaveLastReturnedWith(delta);
    }
  });
});
