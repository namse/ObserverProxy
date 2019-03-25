export class Observer {
  onStateUpdate: () => void;

  constructor({
    onStateUpdate,
  }: {
    onStateUpdate: () => void,
  }) {
    this.onStateUpdate = onStateUpdate;
  }
  stopObserving() {

  }
}

const propertyObserversMap: any = {};

type PropertyObserversMapKey = {
  symbol: Symbol;
  propertyName: string | number | Symbol;
}

function isPureObjectOrArray(target: any): boolean {
  return target instanceof Object && !(target instanceof Date);
}

function getPropertyObservers(key: PropertyObserversMapKey): Observer[] {
  if (!propertyObserversMap[key.symbol as any]) {
    propertyObserversMap[key.symbol as any] = {};
  }
  return propertyObserversMap[key.symbol as any][key.propertyName as any];
}

function setPropertyObservers(key: PropertyObserversMapKey, observers: Observer[]) {
  if (!propertyObserversMap[key.symbol as any]) {
    propertyObserversMap[key.symbol as any] = {};
  }
  propertyObserversMap[key.symbol as any][key.propertyName as any] = observers;
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
    if (!isPureObjectOrArray(fromObjectValue) || !isPureObjectOrArray(toObjectValue)) {
      return;
    }
    copySymbol(fromObjectValue, toObjectValue);
  })
}

const symbolProxyObserversMap: {
  [symbol: string]: Array<{ proxy: any, observer: Observer | undefined }>
} = {};

function makePropertyAsProxy(object: Object, proxy: any, observer: Observer | undefined) {
  Object.entries(object).forEach(([key, value]) => {
    if (isPureObjectOrArray(value)) {
      proxy[key] = createObserverProxy(value, observer);
    }
  });
}

export default function createObserverProxy<T extends Object>(object: T, observer: Observer | undefined): T {
  if (!getSymbol(object)) {
    setSymbol(object);
  }

  const proxy: any = {};
  Object.setPrototypeOf(proxy, Object.getPrototypeOf(object));

  const symbol = getSymbol(object);
  if (!symbolProxyObserversMap[symbol as any]) {
    symbolProxyObserversMap[symbol as any] = [];
  }
  const proxies = symbolProxyObserversMap[symbol as any];
  proxies.push({
    proxy,
    observer,
  });

  makePropertyAsProxy(object, proxy, observer);

  return new Proxy(proxy as Object, {
    get(target: any, name) {
      if (observer) {
        let observers = getPropertyObservers({
          symbol: getSymbol(object),
          propertyName: name,
        });

        // Create Observers
        if (!observers) {
          observers = [];
          setPropertyObservers({
            symbol: getSymbol(object),
            propertyName: name,
          }, observers);
        }

        // Attach Observer
        if (!observers.includes(observer)) {
          observers.push(observer);

          const originalStopObserving = observer.stopObserving;
          observer.stopObserving = () => {
            const index = observers.indexOf(observer);
            observers.splice(index, 1);

            if (originalStopObserving) {
              originalStopObserving();
            }
          }
        }
      }
      const value = (object as any)[name];
      if (isPureObjectOrArray(value)) {
        const childProxy = target[name];
        return childProxy;
      }
      return value;
    },
    set(target: any, name, newValue) {
      if (isPureObjectOrArray(newValue)) {
        const previousValue = (object as any)[name];

        if (previousValue) {
          copySymbol(previousValue, newValue);
        } else {
          setSymbol(newValue);
        }

        const symbol = getSymbol(object);

        symbolProxyObserversMap[symbol as any].forEach(({ proxy, observer }) => {
          proxy[name] = createObserverProxy(newValue, observer);
        });
      }
      Reflect.set(object as Object, name, newValue);

      const observers = getPropertyObservers({
        symbol: getSymbol(object),
        propertyName: name,
      });

      if (observers) {
        observers.forEach(observer => {
          observer.onStateUpdate();
        });
      }

      return true;
    },
  }) as T;
}
