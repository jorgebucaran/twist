import { t, deepEqual } from "../index.js"

import * as Msg from "./msg/index.js"
import { Init, Run, Done, Error, Exit } from "../lib/update.js"

export default [
  t("lib/update", [
    t("init", [
      t("initializes the state", [
        deepEqual(Init(undefined, Msg.Init.props), Msg.Init.state),
      ]),
    ]),
    t("run", [
      t("add a new test result", [
        deepEqual(Run(Msg.Init.state, Msg.Run.props), Msg.Run.state),
        deepEqual(Run(Msg.Run.state, Msg.Run.next.props), Msg.Run.next.state),
      ]),
    ]),
    t("done", [
      t("mark a suite as complete", [
        deepEqual(Done(Msg.Run.next.state, Msg.Done.props), Msg.Done.state),
      ]),
    ]),
    t("exit", [
      t("exit twist", [
        deepEqual(Exit(Msg.Done.state), Msg.Exit.state),
      ]),
    ]),
    t("error", [
      t("state is passed as is", [
        deepEqual(Error(Msg.Error.state, Msg.Error.props), Msg.Error.state),
      ]),
    ]),
  ]),
]
