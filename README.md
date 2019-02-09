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

# How to use - Quick Example

``` JS
const createObserverProxy = require('observer-proxy');

// 0. Prepare your object
const myObject = {
  abc: 123,
  def: 456,
};

// 1. Define your observer
const observer = {
  onStateUpdate: () => {
    console.log('Observer State Update Detected');
  },
  onObserverWillDestroy: () => { // call this funciton before you destroy observer.
    console.log('Observer will destory');
  },
}


// 2. Create Observer Proxy
const observerProxy = createObserverProxy(myObject, observer);



// 3. watch what you want.

// umm... I need abc!
const abc = observerProxy.abc;
console.log(abc); // console output -> 123

console.log(myObject.abc); // console output -> 123


// 4. update
observerProxy.abc = 135; // console output -> 'Observer State Update Detected'

console.log(myObject.abc); // console output -> 135
                           // observerProxy change myObject's value.

observerProxy.def = 246; // console output -> nothing
                       // becuse you didn't get 'def' before!
                       // onStateUpdate not called!

console.log(myObject.def); // console output -> 246
                           // observerProxy change myObject's value.

myObject.abc = 357; // console ouput -> nothing
                    // because object proxy only watch when you change value by object proxy.


// 4.1 onStateUpdate Event by other observer proxy's changing

const observer2 = {
  onStateUpdate: () => {
    console.log('Observer 2 State Update Detected');
  },
  onObserverWillDestroy: () => {
    console.log('Observer 2 will destory');
  },
}
const observerProxy2 = createObserverProxy(myObject, observer2);

observerProxy2.abc = 468; // console output -> 'Observer State Update Detected'
                          // observerProxy2 doesn't detect 'abc'. because we didn't get 'abc' of observerProxy2.

const abcByObserverProxy2 = observerProxy2.abc;

observerProxy2.abc = 579; // console output -> 'Observer State Update Detected'
                          // console output -> 'Observer 2 State Update Detected'

// stop observerProxy2. Thank you observer proxy 2!!
observer2.onObserverWillDestroy();


// 5. Stop wathcing
observer.onObserverWillDestroy();

observerProxy.abc = 222; // console output -> nothing

console.log(myObject.abc); // console output -> 222

console.log(observerProxy.abc); // console output -> 222
console.log(observerProxy2.abc); // console output -> 222
```

# React Example

Here is example for React component. It can be use for Global State like Redux.

```
git clone https://github.com/skatpgusskat/ObserverProxy.git
cd ObserverProxy
npm run build
cd example
npm run start
```
