#!/usr/bin/env node

import { homedir } from "os"
import { resolve } from "path"
import { readFileSync } from "fs"
import { run } from "../index.js"
import { emit } from "../lib/index.js"

const { code, time, files } = emit("init", {
  code: {},
  home: homedir(),
  time: process.hrtime(),
  files: process.argv
    .slice(2)
    .filter((file, i, files) => i === files.indexOf(file))
    .map((file) => resolve(file)),
})

Promise.all(
  files.map((file) =>
    import(file)
      .then(({ default: suite }) =>
        run(suite, (test) =>
          emit("run", {
            test,
            file,
            time: process.hrtime(time),
            code:
              (test.error && code[file]) ||
              (code[file] = readFileSync(file, "utf8")),
          })
        )
      )
      .then(() => emit("done", { file }))
      .catch((error) => emit("error", { file, error }) && process.exit(1))
  )
)
