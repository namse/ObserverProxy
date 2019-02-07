import { Component } from "react";

const initialState = {
  abc: 123,
};

const components: Component[] = [];

const state = new Proxy(initialState, {
  get(target, name) {
    console.log(target, name);
    return (target as any)[name];
  },
  set(target, name, newValue) {
    (target as any)[name] = newValue;

    console.log(components);
    components.forEach(component => {
      component.forceUpdate();
    })
    return true;
  },
});

export default function getGlobalState(reactComponent: Component) {
  return new Proxy(state, {
    get(target, name) {
      console.log('sex ', reactComponent);
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
