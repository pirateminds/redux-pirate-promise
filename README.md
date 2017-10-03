<h1 align="center">redux-pirate-promise</h1>

<h5 align="center">Redux promise middleware enables robust handling of async code in Redux. The middleware enables optimistic updates and dispatches pending, fulfilled and rejected actions. It can be combined with redux-thunk to chain async actions.</h5>

```js
import { createStore, applyMiddleware } from 'redux';
import promiseMiddleware from 'redux-promise-middleware';

function definePromiseMiddlewareHooks() {
    return {
        response: (data, next) => next(data);
        request: (data, next) => {
            data.type = `${data.type}Request`;
            next(data);
        },
        error: (data, next) => {
            let { error } = data;
            let err = error.data && error.data.error || error;

            data.error = err;
            data.type = `${data.type}Error`;

            next(data);
        }
    }
}

export default applyMiddleware(
  promiseMiddleware.bind(null, definePromiseMiddlewareHooks());
)(createStore);
```

There you have two options to use promise in your actions. First is common way define a `promise` property.

```js
const foo = () => ({
  type: 'FOO',
  promise: new Promise();
});
```

Or monkey patching the promise object.

```js
const foo = () => {
  return Object.assign(new Promise(), type: 'FOO');
};
```

The second wariant is very useful when you work a lot with certain API methods, often returning promises at the moment.

## Installation
`npm install redux-promise-middleware -s`

## Features
__&#10049; Handle promise process:__
The library provide possibility to handle `request`, `response`, `error` globally via overriding the default params in the `redux-pirate-promise`. By the default it doenst modify the flow. You can work with promises like with pure function without any overhead.

```js
let {
    request = (data, next) =>  {},
    response = (data, next) =>  next(data),
    error = (data, next) =>  next(data)
} = params;
```

By we found often it's good to trigger store on the request. For examples to show the progress to end user.

```js
import { createStore, applyMiddleware } from 'redux';
import promiseMiddleware from 'redux-promise-middleware';

let params = {
    response: (data, next) => {
        data.type = 'LOADING';
        next(data);
    }
};

export default applyMiddleware(
    promiseMiddleware.bind(null, params);
)(createStore);
```

__&#991; Global error handling:__
The often case, the promise return the error. You needs to handle it some how.

```js
//store.js
import { createStore, applyMiddleware } from 'redux';
import promiseMiddleware from 'redux-promise-middleware';

let params = {
    response: (data, next) => {
        data.type = `${data.type}Error`;
        next(data);
    }
};

export default applyMiddleware(
    promiseMiddleware.bind(null, params);
)(createStore);
```

```js
//reducers.js
export function errors(state = [], action) {
    if (action.type.endsWith('Error')) {
        return [...state, action.error];
    }

    if (action.type === types.clearErrors) {
        return [];
    }

    return state;
}
```

It allow you format error message one place and show errors popup simpler way.

__&#10084; Action chaining:__
As for me the [redux-thunk](https://github.com/gaearon/redux-thunk) is overcomplicated to use. Let's tho a bit we already have promises in many places: API, Async / Await methods, external libraries why do we drop native promise changing wrapping promises to object? 

Like [redux-promise-middleware](https://github.com/pburtchaell/redux-promise-middleware/blob/master/docs/introduction.md) do

```js
// implicit promise
const foo = () => ({
  type: 'FOO',
  payload: new Promise()
});

// explicit promise
const foo = () => ({
  type: 'FOO',
  payload: {
    promise: new Promise()
  }
});
```

When we extends promise object with `redux` type constant. We can have native support of chaning, and no need to bring complex solutions like `redux-thunk`. 

```js
const foo = () => {
  return Object.assign(new Promise(), type: 'FOO');
};

const bar = () => {
  return Object.assign(new Promise(), type: 'BAR');
};
```

So later in the application we can do like that:

```js
foo()
.then(bar)
.then(()=> {
    let state = store.getState();
});
```

or using async await

```js
await foo();
await bar();

let state = store.getState();
```

---
Copyright (c) 2017 pirateminds.com. [Licensed with The MIT License (MIT)](/LICENSE). strictly enforced.