import { Component } from "react";
import { createStateProxy, IObserver } from "./createStateProxy";
import { initialGlobalState } from "./globalState";

export function getGlobalState(observer: IObserver | undefined = undefined) {
  return createStateProxy(initialGlobalState, observer);
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
