export const subscribe = (subscriber, state) => (update, props) => {
  return subscriber((state = update(state, props)))
  return { ...props, ...state }
}
