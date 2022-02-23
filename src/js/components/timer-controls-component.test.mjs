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

const Events = Object.values(ButtonEventMap);

function createCallbacks() {
  return Object.fromEntries(Events.map((ev) => [ev, jest.fn()]));
}

function getAllUndesiredEventsForButton(button) {
  const {[button]: _, ...undesiredEvents} = ButtonEventMap;
  return Object.values(undesiredEvents).map((ev) => ({button, ev}));
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
  it('should show $visibleButtons buttons', () => {
    const timerControlsComponent = new TimerControlsComponent();
    $(document.body).append(timerControlsComponent.rootElement);

    timerControlsComponent.timerState = state;

    const allAvailableButtons = screen.getAllByRole('button');
    expect(allAvailableButtons.map((el) => el.textContent)).toEqual(
      visibleButtons
    );
    allAvailableButtons.forEach((el) => expect(el).toBeVisible());
  });

  it.each(
    visibleButtons.map((button) => ({
      button,
      ev: ButtonEventMap[button],
    }))
  )('should call $ev when $button is clicked', ({button, ev}) => {
    const callbacks = createCallbacks();
    const timerControlsComponent = new TimerControlsComponent(callbacks);
    timerControlsComponent.timerState = state;
    $(document.body).append(timerControlsComponent.rootElement);

    $(screen.getByRole('button', {name: button})).click();

    expect(callbacks[ev]).toBeCalled();
  });

  it.each(
    visibleButtons
      .map((button) => getAllUndesiredEventsForButton(button))
      .flat()
  )('should not call $ev when $button is clicked', ({button, ev}) => {
    const callbacks = createCallbacks();
    const timerControlsComponent = new TimerControlsComponent(callbacks);
    timerControlsComponent.timerState = state;
    $(document.body).append(timerControlsComponent.rootElement);

    $(screen.getByRole('button', {name: button})).click();

    expect(callbacks[ev]).not.toBeCalled();
  });
});
