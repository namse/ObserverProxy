# Obserer Proxy

Observer Proxy is watching object's changing.

Observer Proxy only let you know when the value is changed which you are looking at.

> If you get `object.a`, it will let you know if `object.a` changed.
>
> Then `object.b` changed, it won't let you know. because you never get `object.b`!


You can update your view like React using this automatically.

# Install

```
npm install observer-proxy
```

# How to use

``` JS
import createObserverProxy, { Observer } from 'observer-proxy';

const observer = new Observer({
  onStateUpdate: () => {
    // This funciton will be called when you change property by observer proxy.
    // like `observerProxy.abc = 5;`.
  },
});

// Make observer proxy
const observerProxy = createObserverProxy(myObject, observer);

// Get value
const abc = observerProxy.abc;

// Set value
observerProxy.abc = 5;

// Stop observing
observer.stopObserving();
```

# How to use - Quick Example

``` JS
import createObserverProxy, { Observer } from 'observer-proxy';

// 0. Prepare your object
const myObject = {
  abc: 123,
  def: 456,
};

// 1. Define your observer
const observer = new Observer({
  onStateUpdate: () => {
    console.log('Observer State Update Detected');
  },
});


// 2. Create Observer Proxy
const observerProxy = createObserverProxy(myObject, observer);


// 3. Get myObject's property by observerProxy

// Umm... I need abc!
const abc = observerProxy.abc;
console.log(abc); // console output -> 123

console.log(myObject.abc); // console output -> 123


// 4. Update
observerProxy.abc = 135; // console output -> 'Observer State Update Detected'

console.log(myObject.abc); // console output -> 135
                           // observerProxy change myObject's value.

observerProxy.def = 246; // console output -> nothing
                         // onStateUpdate not called. Becuse you didn't get 'def' before!

console.log(myObject.def); // console output -> 246
                           // observerProxy change myObject's value.

myObject.abc = 357; // console ouput -> nothing
                    // onStateUpdate not called. Because object proxy only watch when you change value by object proxy.


// 4.2 onStateUpdate Event by other observer proxy's changing

const observer2 = new Observer({
  onStateUpdate: () => {
    console.log('Observer 2 State Update Detected');
  },
});

const observerProxy2 = createObserverProxy(myObject, observer2);

observerProxy2.abc = 468; // console output -> 'Observer State Update Detected'
                          // observerProxy2 doesn't detect 'abc'. because we didn't get 'abc' of observerProxy2.

const abcByObserverProxy2 = observerProxy2.abc;

observerProxy2.abc = 579; // console output -> 'Observer State Update Detected'
                          // console output -> 'Observer 2 State Update Detected'

// Stop observerProxy2. Thank you observer proxy 2!!
observer2.stopObserving();


// 5. Stop wathcing
observer.stopObserving();

observerProxy.abc = 222; // console output -> nothing

console.log(myObject.abc); // console output -> 222

console.log(observerProxy.abc); // console output -> 222
console.log(observerProxy2.abc); // console output -> 222
```

# Examples: React Global State

Here is example for React component. It can be use for Global State like Redux.

```
git clone https://github.com/skatpgusskat/ObserverProxy.git
cd ObserverProxy
npm run build
cd examples/react-global-state
npm run start
```

# Reference

## Observer
- new Observer({ onStateUpdate })
  - onStateUpdate: `<Function>` / `() => void`
    - onStateUpdate will be called when change property by observer proxy.
- stopObserving: `<Function>` / `() => void`
  - call this function to stop observing. onStateUpdate will never be called.
