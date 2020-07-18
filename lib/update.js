export default (type, state, props) =>
  type === "init"
    ? {
        time: [0, 0],
        failed: 0,
        passed: 0,
        skipped: 0,
        suites: props.files.map((file) => ({
          ok: true,
          done: false,
          file,
          path: file.replace(`${props.home}/`, ""),
          code: "",
          failed: 0,
          passed: 0,
          skipped: 0,
          tests: [],
        })),
      }
    : type === "run"
    ? {
        ...state,
        time: props.time,
        failed: state.failed + !!props.test.error,
        passed: state.passed + !(props.test.error || props.test.skip),
        skipped: state.skipped + !!props.test.skip,
        suites: state.suites.map((suite) =>
          props.file === suite.file
            ? {
                ...suite,
                ok: suite.ok && !props.test.error,
                code: props.code,
                failed: suite.failed + !!props.test.error,
                passed: suite.passed + !(props.test.error || props.test.skip),
                skipped: suite.skipped + !!props.test.skip,
                tests: suite.tests.concat(props.test),
              }
            : suite
        ),
      }
    : type === "done"
    ? {
        ...state,
        suites: state.suites.map((suite) =>
          props.file === suite.file ? { ...suite, done: true } : suite
        ),
      }
    : type === "error"
    ? props
    : state
