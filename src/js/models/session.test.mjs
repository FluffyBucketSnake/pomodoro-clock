import {jest} from '@jest/globals';

import {Session, SessionState, SessionType} from './session.mjs';

const DefaultSessionOptions = {
  hasLongBreak: false,
  workDuration: 25,
  breakDuration: 5,
  longBreakDuration: 30,
};

afterEach(() => {
  jest.useRealTimers();
});

beforeEach(() => {
  jest.useFakeTimers();
});

test('First session should be numbered 1', () => {
  const session = Session.getInitialSession(DefaultSessionOptions);

  expect(session.number).toBe(1);
});

it.each([...Array(10).keys()])(
  'should be a break when its number is even',
  (k) => {
    const number = 2 * k;
    const session = new Session(number, DefaultSessionOptions);

    expect(session.number).toBe(number);
    expect(session.type).toBe(SessionType.Break);
    expect(session.duration).toBe(DefaultSessionOptions.breakDuration);
  }
);

it.each([...Array(10).keys()])(
  'should be a work session when its number is odd',
  (k) => {
    const number = 2 * k + 1;
    const session = new Session(number, DefaultSessionOptions);

    expect(session.number).toBe(number);
    expect(session.type).toBe(SessionType.Work);
    expect(session.duration).toBe(DefaultSessionOptions.workDuration);
  }
);

it.each([...Array(10).keys()])(
  'if long break is activated, should be a long break when its number is divisible by four',
  (k) => {
    const number = 4 * k;
    const longBreakSessionOptions = {
      ...DefaultSessionOptions,
      hasLongBreak: true,
    };
    const session = new Session(number, longBreakSessionOptions);

    expect(session.number).toBe(number);
    expect(session.type).toBe(SessionType.Break);
    expect(session.duration).toBe(longBreakSessionOptions.longBreakDuration);
  }
);

it.each([1, 2])(
  'under normal conditions, should be tick every second and ring when duration elapses',
  (number) => {
    const sessionEvents = {
      onSessionTick: jest.fn(),
      onSessionEnd: jest.fn(),
    };
    const session = new Session(number, DefaultSessionOptions, sessionEvents);
    const durationInMillisecs = session.duration * 60 * 1000;

    expect(session.state).toBe(SessionState.Idle);
    expect(session.isActive).toBe(false);

    session.start();

    expect(session.state).toBe(SessionState.Running);
    expect(session.isActive).toBe(true);

    jest.advanceTimersByTime(durationInMillisecs / 2);
    session.pause();

    expect(session.state).toBe(SessionState.Paused);
    expect(session.isActive).toBe(true);

    jest.advanceTimersByTime(durationInMillisecs / 2);

    expect(session.state).toBe(SessionState.Paused);
    expect(sessionEvents.onSessionTick).toBeCalledTimes(session.duration * 30);
    expect(sessionEvents.onSessionEnd).not.toBeCalled();

    session.resume();

    expect(session.state).toBe(SessionState.Running);
    expect(session.isActive).toBe(true);

    jest.advanceTimersByTime(durationInMillisecs / 2);

    expect(session.state).toBe(SessionState.Finished);
    expect(session.isActive).toBe(false);
    expect(sessionEvents.onSessionTick).toBeCalledTimes(session.duration * 60);
    expect(sessionEvents.onSessionEnd).toBeCalledTimes(1);
  }
);

it('cannot pause while it is not running', () => {
  const session = new Session(1, DefaultSessionOptions);
  const durationInMillisecs = session.duration * 60 * 1000;
  const error = new Error('Cannot pause while session is not running!');
  const pauseFn = () => session.pause();

  expect(pauseFn).toThrowError(error);

  session.start();
  session.pause();

  expect(pauseFn).toThrowError(error);

  session.resume();
  jest.advanceTimersByTime(durationInMillisecs);

  expect(pauseFn).toThrowError(error);
});

it('cannot resume while it is not paused', () => {
  const session = new Session(1, DefaultSessionOptions);
  const durationInMillisecs = session.duration * 60 * 1000;
  const error = new Error('Cannot resume while session is not paused!');
  const resumeFn = () => session.resume();

  expect(resumeFn).toThrowError(error);

  session.start();
  expect(resumeFn).toThrowError(error);

  session.pause();
  session.resume();

  jest.advanceTimersByTime(durationInMillisecs);

  expect(resumeFn).toThrowError(error);
});

it('cannot start once again', () => {
  const session = new Session(1, DefaultSessionOptions);
  const durationInMillisecs = session.duration * 60 * 1000;
  const error = new Error('Cannot start after session has been started once!');
  const startFn = () => session.start();

  session.start();

  expect(startFn).toThrowError(error);

  session.pause();

  expect(startFn).toThrowError(error);

  session.resume();

  expect(startFn).toThrowError(error);

  jest.advanceTimersByTime(durationInMillisecs);

  expect(startFn).toThrowError(error);
});

it.each([1, 2])('can be stopped before ringing', (number) => {
  const sessionEvents = {
    onSessionTick: jest.fn(),
    onSessionEnd: jest.fn(),
  };
  const session = new Session(number, DefaultSessionOptions, sessionEvents);
  const durationInMillisecs = session.duration * 60 * 1000;

  session.start();
  jest.advanceTimersByTime(durationInMillisecs / 2);
  session.stop();
  jest.advanceTimersByTime(durationInMillisecs / 2);

  expect(session.state).toBe(SessionState.Stopped);
  expect(sessionEvents.onSessionTick).toBeCalledTimes(session.duration * 30);
  expect(sessionEvents.onSessionEnd).not.toBeCalled();
});

it('cannot be started, resumed, paused or stopped again after stopping', () => {
  const session = new Session(1, DefaultSessionOptions);

  session.start();
  session.stop();

  expect(() => session.start()).toThrow();
  expect(() => session.pause()).toThrow();
  expect(() => session.resume()).toThrow();
  expect(() => session.stop()).toThrow();
});

it('cannot be stopped before being started or after finishing', () => {
  const session = new Session(1, DefaultSessionOptions);
  const durationInMillisecs = session.duration * 60 * 1000;
  const error = new Error('Cannot stop session while it is not active!');
  const stopFn = () => session.stop();

  expect(stopFn).toThrowError(error);

  session.start();
  jest.advanceTimersByTime(durationInMillisecs);

  expect(stopFn).toThrowError(error);
});

it.each([...Array(10).keys()])(
  'next session should be one number above the previous',
  (number) => {
    const session = new Session(number, DefaultSessionOptions);

    const sessionEvents = {
      onSessionTick: jest.fn(),
      onSessionEnd: jest.fn(),
    };
    const nextSession = session.getNext(sessionEvents);

    expect(nextSession.number).toBe(number + 1);

    nextSession.start();
    jest.advanceTimersByTime(nextSession.duration * 60 * 1000);

    expect(sessionEvents.onSessionTick).toBeCalledTimes(
      nextSession.duration * 60
    );
    expect(sessionEvents.onSessionEnd).toBeCalledTimes(1);
  }
);
