import * as assert from "assert"

const arrify = (any) => (Array.isArray(any) ? any : [any])

const assertion = (assert) => (actual, expected, stack = Error().stack) => ({
  at: stack ? stack.match(/\d+:\d+/gm)[1].split(/:/) : [],
  stack,
  assert,
  actual,
  expected,
})

export const run = (tests, resolve, name = [], skip = false) =>
  Promise.all(
    arrify(tests).map((t) =>
      skip
        ? resolve({ name, skip })
        : t instanceof Promise
        ? t.then((sub) => run(sub, resolve, name, skip))
        : typeof t === "function"
        ? run(new Promise(t), resolve, name, skip)
        : typeof t.assert === "function"
        ? resolve({
            name,
            error: (({ assert, actual, expected }) => {
              try {
                assert(actual, expected)
              } catch ({ message }) {
                return message
              }
            })(t),
            ...t,
          })
        : run(t.tests, resolve, name.concat(t.name), skip || t.skip)
    )
  )

export const t = (name = "", tests = []) => ({ name, tests: arrify(tests) })
export const skip = (test) => ({ ...test, skip: true })

export const equal = assertion(assert.strictEqual)
export const notEqual = assertion(assert.notStrictEqual)
export const deepEqual = assertion(assert.deepStrictEqual)
export const notDeepEqual = assertion(assert.notDeepStrictEqual)
