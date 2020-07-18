import { dirname } from "path"
import { fileURLToPath } from "url"
import { spawnSync } from "child_process"
import { t, deepEqual, equal } from "../index.js"

export default [
  t("bin/twist", [
    t("JSON.stringify state to stdout inside a tty", [
      ...spawnSync("../bin/twist.js", ["fixed/loser.js"], {
        cwd: dirname(fileURLToPath(import.meta.url)),
        encoding: "utf8",
      })
        .stdout.split("\n")
        .filter((x) => x)
        .map(JSON.parse)
        .map(({ suites: [{ ok, done }], failed }, i) =>
          deepEqual(
            [ok, done, failed],
            i === 0
              ? [true, false, 0] // Msg.Init
              : i === 1
              ? [false, false, 1] // Msg.Run
              : i === 2
              ? [false, true, 1] // Msg.Done
              : []
          )
        ),
    ]),
  ]),
]
