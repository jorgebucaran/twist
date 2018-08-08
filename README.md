# Testmatrix [![npm](https://img.shields.io/npm/v/testmatrix.svg?label=&color=0080FF)](https://github.com/jorgebucaran/testmatrix/releases/latest)

Testmatrix is a declarative test runner for JavaScript.

## Installation

```console
npm i testmatrix
```

## Getting started

Let's start with a basic test to learn how Testmatrix works. Create a new `test.js` file and export your test suite.

```js
exports.default = {
  "array.indexOf()": [
    {
      test: "returns the index at which a given element is in the array",
      assert: (a, b) => a === b,
      actual: ["A", "B", "C"].indexOf("A"),
      expected: 0
    }
  ]
}
```

Every key in your suite object designates a test group. Groups are arrays of tests, where each test is represented as an object. To determine if a test passes or not, we'll compare if the actual and expected values match using the specified assert function. You can use your own assert function or choose from the included ones: `equal`, `notEqual`, `deepEqual` and `notDeepEqual`.

```js
const { equal, notEqual, deepEqual, notDeepEqual } = require("testmatrix")
```

Now add a test script to your package.json file and run `npm test` on the command line.

```json
{
  "scripts": {
    "test": "testmatrix test.js"
  }
}
```

You should see the following [TAP](https://en.wikipedia.org/wiki/Test_Anything_Protocol) output in your console. TAP is a popular format for reporting test results. It's easy for people to read and for machines to parse. See [reporting options](https://github.com/substack/tape#pretty-reporters) for more information.

```console
$ npm test

TAP version 13
# array.indexOf()
ok 1 returns the index at which a given element is in the array

1..1
# tests 1
# pass 1

# ok
```

If you find that your tests are starting to look alike, break them up into functions to reduce boilerplate.

```js
const { equal } = require("testmatrix")

exports.IndexOf = (name, { array, element, expected }) => ({
  name,
  assert: equal,
  actual: array.indexOf(element),
  expected
})
```

Then use it as a test factory.

```js
const { IndexOf } = require("./IndexOf")

exports.default = {
  "array.indexOf()": [
    IndexOf("returns the index at which a given element is in the array", {
      array: ["A", "B", "C"],
      element: "A",
      expected: 0
    }),
    IndexOf("returns -1 if the given element is not in the array", {
      array: ["A", "B", "C"],
      element: "X",
      expected: -1
    })
  ]
}
```

The final step is to add code coverage. Code coverage measures the degree to which our code is executed when our tests run. It tells us how much of our code is used. To enable code coverage, we'll install [istanbuljs/nyc](https://github.com/istanbuljs/nyc) and edit the test script again.

```json
{
  "test": "nyc -r lcov testmatrix test.js && nyc report"
}
```

## Transforming Fixtures

A test fixture is what we feed to our tests. It consists of all the values and expectations that determine if our tests pass or not. Fixtures are framework agnostic while tests are specific to a program. If the program changes we'll have to rewrite some tests, but usually not the fixtures.

Testmatrix allows us to represent tests as plain data, which we can produce from our fixtures using a relatively simple map and reduce transformations.

```js
const { equal } = require("testmatrix")

const IndexOf = ({ name, array, element, expected }) => ({
  name,
  assert: equal,
  actual: array.indexOf(element),
  expected
})

exports.default = {
  "array.indexOf()": [
    {
      name: "returns the index at which a given element is in the array",
      array: ["A", "B", "C"],
      element: "B",
      expected: 1
    },
    {
      name: "returns -1 if the given element is not in the array",
      array: ["A", "B", "C"],
      element: "Z",
      expected: -1
    }
  ].map(IndexOf)
}
```

Alternatively, consider the same example using a more succinct syntax based entirely on arrays.

```js
const { equal } = require("testmatrix")

const IndexOf = ([name, array, element, expected]) => ({
  name,
  assert: equal,
  actual: array.indexOf(element),
  expected
})

exports.default = {
  "array.indexOf()": [
    [
      "returns the index at which a given element is in the array",
      ["A", "B", "C"],
      "B",
      1
    ],
    [
      "returns -1 if the given element is not in the array",
      ["A", "B", "C"],
      "Z",
      0
    ]
  ].map(IndexOf)
}
```

## Asynchronous Tests

We can test side effects and asynchronous code by using a function as the test's actual property. The function receives a function which must be called with the actual value after the operation is done. You are responsible for creating and destroying any resources needed to arrive at this value within this function.

> TODO: Rewrite example using `async` functions instead?

```js
const { equal } = require("testmatrix")

const SlowDivision = ({ name, dividend, divisor, quotient }) => ({
  name,
  assert: equal,
  actual: done =>
    setTimeout(() => {
      done(dividend / divisor)
    }, 1000),
  expected: quotient
})

exports.default = {
  "slow division": [
    SlowDivision({
      name: "divides two numbers slowly",
      dividend: 10,
      divisor: 5,
      quotient: 2
    })
  ]
}
```

## Using ES Modules

You can use ES modules across your entire test suite via [standard-things/esm](https://github.com/standard-things/esm).

```json
{
  "scripts": {
    "test": "nyc -i esm -r lcov testmatrix test.js && nyc report"
  }
}
```

## License

[MIT](LICENSE.md)
