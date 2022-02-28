import {toMillisecs, toSecs} from './time.mjs';

test('milliseconds to seconds conversion', () => {
  expect(toSecs(1000)).toBe(1.0);
  expect(toSecs(1500)).toBe(1.5);
  expect(toSecs(2000)).toBe(2.0);
});

test('seconds to milliseconds conversion', () => {
  expect(toMillisecs(1.0)).toBe(1000);
  expect(toMillisecs(1.5)).toBe(1500);
  expect(toMillisecs(2.0)).toBe(2000);
});
