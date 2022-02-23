import '@testing-library/jest-dom';
import {jest} from '@jest/globals';
import {screen} from '@testing-library/dom';
import $ from 'jquery';

import {TimerControlsComponent} from './timer-controls-component.mjs';
import {TimerState} from '../timer.mjs';

beforeEach(() => {
  $(document.body).empty();
});

const ButtonEventMap = {
  Start: 'onStart',
  Stop: 'onStop',
  Options: 'onShowOptions',
  Pause: 'onPause',
  Resume: 'onResume',
  Reset: 'onReset',
};

const EventNames = Object.values(ButtonEventMap);

function createCallbacks() {
  return Object.fromEntries(
    EventNames.map((eventName) => [eventName, jest.fn()])
  );
}

describe.each([
  {
    state: TimerState.Stopped,
    prettyState: 'stopped',
    visibleButtons: ['Start', 'Options'],
  },
  {
    state: TimerState.Running,
    prettyState: 'running',
    visibleButtons: ['Stop', 'Pause', 'Reset'],
  },
  {
    state: TimerState.Paused,
    prettyState: 'paused',
    visibleButtons: ['Stop', 'Resume', 'Reset'],
  },
])('while in state $prettyState', ({state, visibleButtons}) => {
  it('should only show $visibleButtons buttons', () => {
    const timerControlsComponent = new TimerControlsComponent();
    timerControlsComponent.timerState = state;
    $(document.body).append(timerControlsComponent.rootElement);

    const allAvailableButtons = screen.getAllByRole('button');

    expect(allAvailableButtons.map((el) => el.textContent)).toEqual(
      visibleButtons
    );
    allAvailableButtons.forEach((el) => expect(el).toBeVisible());
  });

  it.each(
    visibleButtons.map((text) => ({
      text,
      eventName: ButtonEventMap[text],
    }))
  )(
    'should call $eventName if, and only if, $text is clicked',
    ({text, eventName}) => {
      const callbacks = createCallbacks();
      const timerControlsComponent = new TimerControlsComponent(callbacks);
      timerControlsComponent.timerState = state;
      $(document.body).append(timerControlsComponent.rootElement);

      $(screen.getByRole('button', {name: text})).click();

      expect(callbacks[eventName]).toBeCalled();
    }
  );
});
