export const Init = {
  props: {
    home: "/twist",
    time: [Infinity, Infinity],
    files: ["/twist/super.js", "/twist/ultra.js"],
  },
  state: {
    time: [0, 0],
    failed: 0,
    passed: 0,
    skipped: 0,
    suites: [
      {
        ok: true,
        done: false,
        file: "/twist/super.js",
        path: "super.js",
        code: "",
        failed: 0,
        passed: 0,
        skipped: 0,
        tests: [],
      },
      {
        ok: true,
        done: false,
        file: "/twist/ultra.js",
        path: "ultra.js",
        code: "",
        failed: 0,
        passed: 0,
        skipped: 0,
        tests: [],
      },
    ],
  },
}

export const Run = {
  props: {
    time: [42, 0],
    code: "super",
    file: "/twist/super.js",
    test: { name: "duper", error: null },
  },
  state: {
    time: [42, 0],
    failed: 0,
    passed: 1,
    skipped: 0,
    suites: [
      {
        ok: true,
        done: false,
        file: "/twist/super.js",
        path: "super.js",
        code: "super",
        failed: 0,
        passed: 1,
        skipped: 0,
        tests: [
          {
            error: null,
            name: "duper",
          },
        ],
      },
      {
        ok: true,
        done: false,
        file: "/twist/ultra.js",
        path: "ultra.js",
        code: "",
        failed: 0,
        passed: 0,
        skipped: 0,
        tests: [],
      },
    ],
  },
  next: {
    props: {
      time: [42, 42],
      code: "ultra",
      file: "/twist/ultra.js",
      test: { name: "pop", error: {} },
    },
    state: {
      time: [42, 42],
      failed: 1,
      passed: 1,
      skipped: 0,
      suites: [
        {
          ok: true,
          done: false,
          file: "/twist/super.js",
          path: "super.js",
          code: "super",
          failed: 0,
          passed: 1,
          skipped: 0,
          tests: [
            {
              error: null,
              name: "duper",
            },
          ],
        },
        {
          ok: false,
          done: false,
          file: "/twist/ultra.js",
          path: "ultra.js",
          code: "ultra",
          failed: 1,
          passed: 0,
          skipped: 0,
          tests: [{ name: "pop", error: {} }],
        },
      ],
    },
  },
}

export const Done = {
  props: {
    file: "/twist/super.js",
  },
  state: {
    time: [42, 42],
    failed: 1,
    passed: 1,
    skipped: 0,
    suites: [
      {
        ok: true,
        done: true,
        failed: 0,
        passed: 1,
        skipped: 0,
        file: "/twist/super.js",
        path: "super.js",
        code: "super",
        tests: [
          {
            error: null,
            name: "duper",
          },
        ],
      },
      {
        ok: false,
        done: false,
        failed: 1,
        passed: 0,
        skipped: 0,
        file: "/twist/ultra.js",
        path: "ultra.js",
        code: "ultra",
        tests: [{ name: "pop", error: {} }],
      },
    ],
  },
}

export const Error = {
  props: Infinity,
  state: Infinity,
}
