# Twist

> Declarative testing for JavaScript.

```js
import { t, equal } from "twist"

export default [
  t("array.indexOf()", [
    t("returns the index at which a given element is in the array", [
      equal(["A", "B", "C"].indexOf("A"), 0),
    ]),
  ]),
]
```

## Installation

```console
npm i twist
```

## License

[MIT](LICENSE.md)
