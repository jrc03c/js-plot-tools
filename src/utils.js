const { range } = require("@jrc03c/js-math-tools")

function linspace(a, b, n) {
  const step = (b - a) / (n - 1)
  return range(a, b + step, step)
}

function valueMap(x, a, b, c, d) {
  return ((d - c) * (x - a)) / (b - a) + c
}

module.exports = {
  linspace,
  valueMap,
}
