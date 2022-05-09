#!/usr/bin/env node

import { argv, hrtime, exit, platform, _rawDebug as log } from "process"
import { homedir } from "os"
import { resolve } from "path"
import { readFileSync } from "fs"
import { run } from "../index.js"
import { subscribe } from "../lib/state.js"
import * as Msg from "../lib/update.js"
import view from "../lib/view.js"

// const CLS = `\x1b[2J\x1b[${platform === "win32" ? "0f" : "3J\x1b[H"}`
const CLS = `\x1b[H\E[2J`

const dispatch = subscribe((state) => log(CLS + view(state)))

const { home, time, files } = {
  home: homedir(),
  time: hrtime(),
  files: argv.slice(2).filter((file, i, files) => i === files.indexOf(file)),
}

dispatch(Msg.Init, { home, time, files })

Promise.all(
  files.map((file) =>
    import(resolve(file))
      .then(({ default: suite }) =>
        run(suite, (test) =>
          dispatch(Msg.Run, {
            test,
            file,
            time: hrtime(time),
            code: readFileSync(file, "utf8"),
          })
        )
      )
      .then(() => dispatch(Msg.Done, { file }))
      .catch((error) => (dispatch(Msg.Error, error), exit(1)))
  )
).then(() => {
  dispatch(Msg.Exit)
  exit(0)
})
