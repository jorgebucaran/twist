import { dim, bold, reset, inverse, red, green, yellow } from "colorette"

const ROWS = 5
const RUNS = inverse(bold(yellow(" RUNS ")))
const FAIL = inverse(bold(red(" FAIL ")))
const PASS = inverse(bold(green(" PASS ")))

const indent = (count) => " ".repeat((count + 1) * 2 - 1)

const stripIndent = (
  code,
  indent = code
    .match(/^[ \t]*(?=\S)/gm)
    .reduce((n, ws) => Math.min(n, ws.length), Infinity)
) => code.replace(RegExp(`^[ \\t]{${indent}}`, "gm"), "")

const pathView = (path, [ln, col] = []) =>
  path.replace(/^(.*\/)([^/]*)$/, (_, dir, name) => dim(dir) + bold(name)) +
  (ln ? dim(`:${ln}:${col}`) : "")

const nameView = (name) => name.map((s, i) => indent(i) + `▸ ${s}`).join("\n")

const errorView = (error, ws, nl = error.match(/^.*\n\n/) ? "" : "\n") =>
  error
    .replace(/^.*|$/g, (s) => bold(red(s && `● ${s}`)) + nl)
    .replace(/^/gm, ws)

const lineView = (code, ln, col, start = ln - (ROWS + 1) / 2) =>
  code
    .split(/\n/)
    .slice(start, start + ROWS)
    .map((code, i) =>
      i === ~~(ROWS / 2)
        ? code.slice(0, col - 1) + inverse(code[col - 1]) + code.slice(col)
        : code
    )
    .join("\n")

const codeView = (code, ws, [ln, col], max = `${ln + ~~(ROWS / 2)}`.length) =>
  stripIndent(lineView(code, ln, col))
    .split(/\n/)
    .reduce(
      (s, code, i, { length }, n = ln - ~~(length / 2) + i) =>
        s + (ln - n ? dim : reset)(ws + `${n}`.padStart(max) + `｜ ${code}\n`),
      ""
    )

const summaryView = (failed, passed, running = 0, skipped = 0, total) =>
  [
    failed && red(`${bold(failed)} failed`),
    passed && green(`${bold(passed)} passed`),
    running && yellow(`${bold(running)} running`),
    skipped && yellow(`${bold(skipped)} skipped`),
    total !== 0 ? `${bold(failed + passed + running + skipped)} total` : "",
  ]
    .filter((s) => s)
    .join(", ")

const mainView = ({ suites, failed, passed, skipped, time: [s, ms] }) =>
  [...suites]
    .sort((a, { ok, done, path }) =>
      (a.ok || a.path > path) && !ok ? 1 : (a.done && !done) || !a.ok ? -1 : 0
    )
    .reduce(
      (s, { ok, done, path, code, tests, failed, passed, skipped }, i, peek) =>
        [...tests]
          .sort((a, b) => a.at && a.at[0] - b.at[0])
          .reduce(
            (s, { name, error, at }) =>
              error
                ? `${FAIL} ${pathView(path, at)}\n` +
                  `${nameView(name)}\n` +
                  `${errorView(error, indent(name.length))}\n` +
                  `${codeView(code, indent(name.length), at)}\n` +
                  s
                : s,
            ""
          ) +
        s +
        (i && ok && !peek[i - 1].ok ? "\n" : "") +
        `${ok ? (done ? PASS : RUNS) : FAIL} ${pathView(path)} ` +
        `(${summaryView(failed, passed, 0, skipped, 0)})\n`,
      ""
    ) +
  `\n${bold("Suites:")} ${summaryView(
    ...suites.reduce(
      ([failed, passed, running], { ok, done }) => [
        failed + !ok,
        passed + (ok && done),
        running + (ok && !done),
      ],
      [0, 0, 0]
    )
  )}` +
  `\n${bold("Tests:")}  ${summaryView(failed, passed, 0, skipped)}` +
  `\nTime:   ${s}.${Math.trunc(ms / 2e6)}s`

export default (state) => (state.error ? state.error.stack : mainView(state))
