import view from "./view.js"
import update from "./update.js"
import subscribe from "./subscribe.js"

const CLEAR_TERMINAL =
  process.platform === "win32" ? `\x1b[2J\x1b[0f` : `\x1b[2J\x1b[3J\x1b[H`

export const emit = subscribe(
  update,
  process.stdout.isTTY
    ? (state) => process._rawDebug(CLEAR_TERMINAL + view(state))
    : (state) => process.stdout.write(JSON.stringify(state) + "\n")
)
