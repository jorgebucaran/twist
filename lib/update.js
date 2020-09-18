export const Init = (_, { files, home }) => ({
  time: [0, 0],
  failed: 0,
  passed: 0,
  skipped: 0,
  suites: files.map((file) => ({
    ok: true,
    done: false,
    file,
    code: "",
    path: file.replace(`${home}/`, ""),
    failed: 0,
    passed: 0,
    skipped: 0,
    tests: [],
  })),
})

export const Run = (state, { time, file, code, test }) => ({
  ...state,
  time: time,
  failed: state.failed + !!test.error,
  passed: state.passed + !(test.error || test.skip),
  skipped: state.skipped + !!test.skip,
  suites: state.suites.map((suite) =>
    file === suite.file
      ? {
          ...suite,
          ok: suite.ok && !test.error,
          code,
          failed: suite.failed + !!test.error,
          passed: suite.passed + !(test.error || test.skip),
          skipped: suite.skipped + !!test.skip,
          tests: suite.tests.concat(test),
        }
      : suite
  ),
})

export const Done = (state, { file }) => ({
  ...state,
  suites: state.suites.map((suite) =>
    file === suite.file ? { ...suite, done: true } : suite
  ),
})

export const Error = (_, error) => error
