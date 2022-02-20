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
  const dateNowMock = () => time;
  const advanceDateByTime = (milliseconds) => (time += milliseconds);
  return [dateNowMock, advanceDateByTime];
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
    clock.stop();
    jest.advanceTimersByTime(toMillisecs(1));

    expect(clock.isRunning).toBe(false);
    expect(tick).not.toHaveBeenCalled();
  });
});

describe('presuming browser lag', () => {
  it('should pass the actual time since the last tick as parameter', () => {
    let advanceDateByTime;
    [Date.now, advanceDateByTime] = mockDateNow();
    const lag = 1.5;
    const tick = jest.fn((delta) => toSecs(delta));
    const clock = new Clock(tick);

    clock.start();
    advanceDateByTime(toMillisecs(lag));
    jest.advanceTimersToNextTimer();

    expect(tick).toHaveReturnedWith(lag);
  });
});
