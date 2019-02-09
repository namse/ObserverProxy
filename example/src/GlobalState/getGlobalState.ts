import { Component } from "react";
import createObserverProxy, { IObserver } from "../../../src/createObserverProxy";
import { initialGlobalState } from "./globalState";

export function getGlobalState(observer: IObserver | undefined = undefined) {
  return createObserverProxy(initialGlobalState, observer);
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
