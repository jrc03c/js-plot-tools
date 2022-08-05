const { range } = require("@jrc03c/js-math-tools")

function linspace(a, b, n) {
  const step = (b - a) / (n - 1)
  return range(a, b + step, step)
}

module.exports = {
  linspace,
}
