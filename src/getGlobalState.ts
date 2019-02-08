import { Component } from "react";

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

const propertyComponentsMap: any = {};

type PropertyComponentsMapKey = {
  symbol: Symbol;
  propertyName: string | number | Symbol;
}

function getPropertyComponents(key: PropertyComponentsMapKey): Component[] {
  if (!propertyComponentsMap[key.symbol as any]) {
    propertyComponentsMap[key.symbol as any] = {};
  }
  return propertyComponentsMap[key.symbol as any][key.propertyName as any];
}

function setPropertyComponents(key: PropertyComponentsMapKey, components: Component[]) {
  if (!propertyComponentsMap[key.symbol as any]) {
    propertyComponentsMap[key.symbol as any] = {};
  }
  propertyComponentsMap[key.symbol as any][key.propertyName as any] = components;
}

function setSymbol(object: any, symbol: symbol = Symbol()) {
  object.__symbol__ = Symbol();
}

function getSymbol(object: any): symbol {
  return object.__symbol__;
}

function copySymbol(fromObject: any, toObject: any) {
  const symbol = getSymbol(fromObject);
  setSymbol(toObject, symbol);

  Object.keys(fromObject).forEach((key) => {
    const fromObjectValue = fromObject[key];
    const toObjectValue = toObject[key];
    if (typeof fromObjectValue !== 'object' || typeof toObjectValue !== 'object') {
      return;
    }
    copySymbol(fromObjectValue, toObjectValue);
  })
}

const symbolProxyComponentsMap: {
  [symbol: string]: Array<{ proxy: any, component: Component }>
} = {};

const subscribingReactComponents: Set<Component> = new Set();

function makePropertyAsProxy(object: Object, proxy: any, reactComponent: Component) {
  Object.entries(object).forEach(([key, value]) => {
    if (typeof value === 'object') {
      proxy[key] = createObserverProxy(value, reactComponent);
    }
  });
}

function createObserverProxy<T>(object: T, reactComponent: Component): T {
  if (!getSymbol(object)) {
    setSymbol(object);
  }

  const proxy: any = {};
  const symbol = getSymbol(object);
  if (!symbolProxyComponentsMap[symbol as any]) {
    symbolProxyComponentsMap[symbol as any] = [];
  }
  const proxies = symbolProxyComponentsMap[symbol as any];
  proxies.push({
    proxy,
    component: reactComponent,
  });

  makePropertyAsProxy(object, proxy, reactComponent);

  return new Proxy(proxy as Object, {
    get(target: any, name) {
      console.log(`i use -------------------------------------${name as string}`);
      if (reactComponent) {
        let components = getPropertyComponents({
          symbol: getSymbol(object),
          propertyName: name,
        });
        if (!components) {
          components = [];
          setPropertyComponents({
            symbol: getSymbol(object),
            propertyName: name,
          }, components);
        }

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
      }
      const value = (object as any)[name];
      if (typeof value === 'object') {
        const childProxy = target[name];
        return childProxy;
      }
      return value;
    },
    set(target: any, name, newValue) {
      if (typeof newValue === 'object') {
        const previousValue = (object as any)[name];

        copySymbol(previousValue, newValue);

        const symbol = getSymbol(object);

        symbolProxyComponentsMap[symbol as any].forEach(({ proxy, component }) => {
          proxy[name] = createObserverProxy(newValue, component);
        });
      }

      console.log("before");
      console.log(target, name, newValue);
      Reflect.set(object as Object, name, newValue);
      console.log("after");

      const components = getPropertyComponents({
        symbol: getSymbol(object),
        propertyName: name,
      });

      console.log(components);

      if (components) {
        components.forEach(component => {
          component.forceUpdate();
        });
      }

      return true;
    },
  }) as T;
}

console.log('after init state')
export default function getGlobalState(reactComponent: Component) {
  subscribingReactComponents.add(reactComponent);
  return createObserverProxy(initialState, reactComponent);
}
