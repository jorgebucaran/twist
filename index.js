import * as assert from "assert"

const arrify = (any) => (Array.isArray(any) ? any : [any])

const test =
  (assert) =>
  (actual, expected, stack = Error().stack) => ({
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
        : Array.isArray(t.tests)
        ? run(t.tests, resolve, name.concat(t.name), skip || t.skip)
        : resolve({
            error: (({ assert, actual, expected }) => {
              try {
                assert(actual, expected)
              } catch ({ message }) {
                return message
              }
            })(t),
            name,
            ...t,
          })
    )
  )

export const t = (name = "", tests = []) => ({ name, tests: arrify(tests) })
export const skip = (test) => ({ ...test, skip: true })

export const equal = test(assert.strictEqual)
export const notEqual = test(assert.notStrictEqual)
export const deepEqual = test(assert.deepStrictEqual)
export const notDeepEqual = test(assert.notDeepStrictEqual)
