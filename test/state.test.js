import { t, equal, deepEqual } from "../index.js"
import { subscribe } from "../lib/state.js"

const Zord = (state, props) => [
  t("state is undefined by default", equal(state, undefined)),
  t("a message takes a payload with props", [
    deepEqual(props, { morph: true }),
  ]),
]

export default [
  t("lib/subscribe", [
    t("subscribe to state updates", [
      (done) => subscribe(done)(Zord, { morph: true }),
    ]),
  ]),
]
