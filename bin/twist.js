#!/usr/bin/env node

import { homedir } from "os"
import { resolve } from "path"
import { readFileSync } from "fs"
import { run } from "../index.js"
import { subscribe } from "../lib/state.js"
import * as Msg from "../lib/update.js"
import view from "../lib/view.js"

const CLS = `\x1b[2J\x1b[${process.platform === "win32" ? "0f" : "3J\x1b[H"}`

const dispatch = subscribe((state) =>
  (process.env.CI && state.exit) || !process.env.CI
    ? process._rawDebug(CLS + view(state))
    : ""
)

const { code, time, files } = dispatch(Msg.Init, {
  code: {},
  home: homedir(),
  time: process.hrtime(),
  files: process.argv
    .slice(2)
    .filter((file, i, files) => i === files.indexOf(file)),
})

Promise.all(
  files.map((file) =>
    import(resolve(file))
      .then(({ default: suite }) =>
        run(suite, (test) =>
          dispatch(Msg.Run, {
            test,
            file,
            time: process.hrtime(time),
            code:
              (test.error && code[file]) ||
              (code[file] = readFileSync(file, "utf8")),
          })
        )
      )
      .then(() => dispatch(Msg.Done, { file }))
      .catch((error) => dispatch(Msg.Error, { file, error }) && process.exit(1))
  )
).then(() => dispatch(Msg.Exit) && process.exit(0))
