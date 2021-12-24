const { linspace } = require("./utils.js")
const { min, max } = require("@jrc03c/js-math-tools")

class AbstractPlotter {
  constructor() {
    const self = this
    self.instructions = []
    self.shouldDrawAxes = true
    self.shouldDrawAxisTicks = true
    self.shouldSetBoundsAutomatically = true
    self.padding = 25
  }

  clear() {
    const self = this
    self.instructions = []
    return self
  }

  dehydrate() {
    const self = this
    return JSON.stringify(self)
  }

  setBounds(xmin, xmax, ymin, ymax) {
    const self = this
    self.shouldSetBoundsAutomatically = false

    self.instructions.push({
      action: "set-bounds",
      data: { xmin, ymin, xmax, ymax },
    })

    return self
  }

  scatter(x, y) {
    const self = this

    self.instructions.push({
      action: "draw",
      type: "scatter",
      data: { x, y },
    })

    return self
  }

  line(x, y) {
    const self = this

    self.instructions.push({
      action: "draw",
      type: "line",
      data: { x, y },
    })

    return self
  }

  hist(values, bins) {
    const self = this
    bins = bins || 20

    const x = linspace(min(values), max(values), bins)
    const y = []

    for (let i = 0; i < x.length - 1; i++) {
      const count = values.filter(v => v >= x[i] && v < x[i + 1]).length
      y.push(count)
    }

    self.instructions.push({
      action: "draw",
      type: "hist",
      data: { x, y },
    })

    return self
  }

  show() {
    throw new Error("The `show` method must be overridden in a concrete class!")
  }
}

module.exports = AbstractPlotter
