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

``` TS
import createObserverProxy from 'observer-proxy'

// 0. Prepare your object
const initialGlobalState = {
  abc: 123,
  def: 456,
};

// 1. Define your observer
function onStateUpdate() {
  console.log('state update (onStateUpdate called)');
}

// call this funciton before you destroy observer.
function onObserverWillDestroy() {

},

const observer = {
  onStateUpdate,
  onObserverWillDestroy,
}


// 2. Create Observer Proxy
const objectProxy = createObserverProxy(initialGlobalState, observer);



// 3. watch what you want.

// umm... I need abc!
const abc = objectProxy.abc;
console.log(abc);
...


// 4. update
objectProxy.abc = 135; // console output -> 'state update (onStateUpdate called)'

objectProxy.def = 246; // console output -> nothing
                       // becuse you didn't get 'def' before!
                       // onStateUpdate not called!


// 5. Stop wathcing
onObserverWillDestroy();

objectProxy.abc = 222; // console output -> nothing

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
