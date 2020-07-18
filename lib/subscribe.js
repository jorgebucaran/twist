export default (update, view, state) => (type, props) => (
  view((state = update(type, state, props))), props
)
