export const subscribe = (listener, state) => (update, props) => (
  listener((state = update(state, props))), props
)
