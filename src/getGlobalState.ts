import { Component } from "react";

interface IState {
  abc: 123,
  objectProperty: {
    child: {
      value: string,
    }
  },
}

const initialState: IState = {
  abc: 123,
  objectProperty: {
    child: {
      value: "namse is Messi of bed",
    },
  },
};

const components: Component[] = [];

function createObserverProxy<T>(object: T): T {
  Object.entries(object).forEach(([key, value]) => {
    if (typeof value === 'object') {
      (object as any)[key] = createObserverProxy(value);
    }
  });

  return new Proxy(object as Object, {
    set(target, name, newValue) {
      if (typeof newValue === 'object') {
        newValue = createObserverProxy(newValue);
      }

      (target as any)[name] = newValue;

      components.forEach(component => {
        component.forceUpdate();
      })
      return true;
    },
  }) as T;
}

const state = createObserverProxy<IState>(initialState);

export default function getGlobalState(reactComponent: Component) {
  return new Proxy(state, {
    get(target, name) {
      if (!components.includes(reactComponent)) {
        components.push(reactComponent);

        const originalComponentWillUnmount = reactComponent.componentWillUnmount;
        reactComponent.componentWillUnmount = () => {
          const index = components.indexOf(reactComponent);
          components.splice(index, 1);

          if (originalComponentWillUnmount) {
            originalComponentWillUnmount.call(reactComponent);
          }
        }
      }
      return (target as any)[name];
    }
  });
}
