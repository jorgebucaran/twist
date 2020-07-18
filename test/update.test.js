import { t, deepEqual } from "../index.js"

import * as Msg from "./msg/index.js"
import update from "../lib/update.js"

export default [
  t("lib/update", [
    t("init", [
      t("initializes the state", [
        deepEqual(update(Msg.Init.type, null, Msg.Init.props), Msg.Init.state),
      ]),
    ]),
    t("run", [
      t("add a new test result", [
        deepEqual(
          update(Msg.Run.type, Msg.Init.state, Msg.Run.props),
          Msg.Run.state
        ),
        deepEqual(
          update(Msg.Run.type, Msg.Run.state, Msg.Run.next.props),
          Msg.Run.next.state
        ),
      ]),
    ]),
    t("done", [
      t("mark a suite as complete", [
        deepEqual(
          update(Msg.Done.type, Msg.Run.next.state, Msg.Done.props),
          Msg.Done.state
        ),
      ]),
    ]),
    t("error", [
      t("state is passed as is", [
        deepEqual(
          update(Msg.Error.type, Msg.Error.state, Msg.Error.props),
          Msg.Error.state
        ),
      ]),
    ]),
    t("100% coverage", [deepEqual(update(null, null), null)]),
  ]),
]
