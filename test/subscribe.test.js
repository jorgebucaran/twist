import { t, equal, deepEqual } from "../index.js"
import subscribe from "../lib/subscribe.js"

export default [
  t("lib/subscribe", [
    t("subscribe to state updates", [
      (done) =>
        subscribe(
          (type, state, props) => [
            t("state is undefined by default", equal(state, undefined)),
            t("a message has a type", equal(type, "msg:zord")),
            t("a message takes a payload with props", [
              deepEqual(props, { morph: true }),
            ]),
          ],
          done
        )("msg:zord", { morph: true }),
    ]),
  ]),
]
