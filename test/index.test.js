import { t, skip, run, equal, deepEqual, notEqual } from "../index.js"

export default [
  t("twist/index", [
    t("t function", [
      t("create an empty test tree", [
        deepEqual(t(), { name: "", tests: [] }),
        deepEqual(t("zord"), { name: "zord", tests: [] }),
        deepEqual(t("hyper", [t("turbo", [])]), {
          name: "hyper",
          tests: [
            {
              name: "turbo",
              tests: [],
            },
          ],
        }),
      ]),
    ]),

    t("skip function", [
      t("skip a test", [
        deepEqual(skip(t("void")), {
          name: "void",
          skip: true,
          tests: [],
        }),
      ]),
      t("skip a test tree", [
        (done) =>
          run(
            t("mega", [
              t("zord", [
                skip(
                  t("morph", [
                    equal(Infinity + Infinity, 0), // Skipped!
                  ])
                ),
              ]),
            ]),
            (test) =>
              done(
                deepEqual(test, {
                  name: ["mega", "zord", "morph"],
                  skip: true,
                })
              )
          ),
      ]),
    ]),

    t("run function", [
      t("run with errors", [
        (done) => (
          run(t("whoops", equal(true, false, null)), (test) =>
            done(
              deepEqual(test, {
                at: [],
                stack: null,
                error:
                  "Expected values to be strictly equal:\n\ntrue !== false\n",
                actual: true,
                assert: equal().assert,
                expected: false,
                name: ["whoops"],
              })
            )
          ),
          {}
        ),
      ]),
    ]),

    t("assert functions", [
      deepEqual(equal(1, 2, null), {
        at: [],
        stack: null,
        actual: 1,
        assert: equal().assert,
        expected: 2,
      }),
      deepEqual(notEqual(1, 2, null), {
        at: [],
        stack: null,
        actual: 1,
        assert: notEqual().assert,
        expected: 2,
      }),
      deepEqual(deepEqual([Infinity], [Infinity], null), {
        at: [],
        stack: null,
        actual: [Infinity],
        assert: deepEqual().assert,
        expected: [Infinity],
      }),
    ]),
  ]),
]
