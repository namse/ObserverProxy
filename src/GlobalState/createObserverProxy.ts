export interface IObserver {
  onStateUpdate: () => void;
  onObserverWillDestroy: (() => void) | undefined;
}

const propertyObserversMap: any = {};

type PropertyObserversMapKey = {
  symbol: Symbol;
  propertyName: string | number | Symbol;
}

function getPropertyObservers(key: PropertyObserversMapKey): IObserver[] {
  if (!propertyObserversMap[key.symbol as any]) {
    propertyObserversMap[key.symbol as any] = {};
  }
  return propertyObserversMap[key.symbol as any][key.propertyName as any];
}

function setPropertyObservers(key: PropertyObserversMapKey, observers: IObserver[]) {
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
    if (typeof fromObjectValue !== 'object' || typeof toObjectValue !== 'object') {
      return;
    }
    copySymbol(fromObjectValue, toObjectValue);
  })
}

const symbolProxyObserversMap: {
  [symbol: string]: Array<{ proxy: any, observer: IObserver | undefined }>
} = {};

function makePropertyAsProxy(object: Object, proxy: any, observer: IObserver | undefined) {
  Object.entries(object).forEach(([key, value]) => {
    if (typeof value === 'object') {
      proxy[key] = createObserverProxy(value, observer);
    }
  });
}

export function createObserverProxy<T>(object: T, observer: IObserver | undefined): T {
  if (!getSymbol(object)) {
    setSymbol(object);
  }

  const proxy: any = {};
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
      // console.log(`i use -------------------------------------${name as string}`);
      if (observer) {
        let observers = getPropertyObservers({
          symbol: getSymbol(object),
          propertyName: name,
        });
        if (!observers) {
          observers = [];
          setPropertyObservers({
            symbol: getSymbol(object),
            propertyName: name,
          }, observers);
        }

        if (!observers.includes(observer)) {
          observers.push(observer);

          const originalOnObserverWillDestroy = observer.onObserverWillDestroy;
          observer.onObserverWillDestroy = () => {
            const index = observers.indexOf(observer);
            observers.splice(index, 1);

            if (originalOnObserverWillDestroy) {
              originalOnObserverWillDestroy();
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

        symbolProxyObserversMap[symbol as any].forEach(({ proxy, observer }) => {
          proxy[name] = createObserverProxy(newValue, observer);
        });
      }

      console.log("before");
      console.log(target, name, newValue);
      Reflect.set(object as Object, name, newValue);
      console.log("after");

      const observers = getPropertyObservers({
        symbol: getSymbol(object),
        propertyName: name,
      });

      console.log(observers);

      if (observers) {
        observers.forEach(observer => {
          observer.onStateUpdate();
        });
      }

      return true;
    },
  }) as T;
}
