import { Component } from "react";
import { createStateProxy, IObserver } from "./createStateProxy";

interface IState {
  abc: number,
  objectProperty: {
    child: {
      value: string,
    }
  },
  arrayArrayObjectProperty: { value: string }[][],
  arrayProperty: string[],
}

const initialState: IState = {
  abc: 123,
  objectProperty: {
    child: {
      value: "namse is Messi of bed",
    },
  },
  arrayArrayObjectProperty: [
    [
      {
        value: '0, 0',
      },
      {
        value: '0, 1',
      },
      {
        value: '0, 2',
      },
    ],
    [
      {
        value: '1, 0',
      },
      {
        value: '1, 1',
      },
      {
        value: '1, 2',
      },
    ],
  ],
  arrayProperty: ['0'],
};

console.log('after init state')
export function getGlobalState(observer: IObserver | undefined = undefined) {
  return createStateProxy(initialState, observer);
}

export function getGlobalStateForReactComponent(reactComponent: Component) {
  const observer = {
    onStateUpdate: () => {
      reactComponent.forceUpdate();
    },
    onObserverWillDestroy: () => {},
  }

  if (reactComponent.componentWillUnmount) {
    const originalComponentWillUnmount = reactComponent.componentWillUnmount;

    reactComponent.componentWillUnmount = () => {
      observer.onObserverWillDestroy();

      originalComponentWillUnmount.call(reactComponent);
    }
  }

  return getGlobalState(observer);
}
