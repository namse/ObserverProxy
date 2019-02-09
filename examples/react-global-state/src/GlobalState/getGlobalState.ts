import { Component } from "react";
import createObserverProxy, { Observer } from "../../../../dist/createObserverProxy";
import { initialGlobalState } from "./globalState";

export function getGlobalState(observer: Observer | undefined = undefined) {
  return createObserverProxy(initialGlobalState, observer);
}

export function getGlobalStateForReactComponent(reactComponent: Component) {
  const observer = new Observer({
    onStateUpdate: () => {
      reactComponent.forceUpdate();
    },
  });

  if (reactComponent.componentWillUnmount) {
    const originalComponentWillUnmount = reactComponent.componentWillUnmount;

    reactComponent.componentWillUnmount = () => {
      observer.stopObserving();

      originalComponentWillUnmount.call(reactComponent);
    }
  }

  return getGlobalState(observer);
}
