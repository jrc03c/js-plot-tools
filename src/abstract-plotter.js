const { MathError, max, min, range } = require("@jrc03c/js-math-tools")

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

    const xmin = min(values)
    const xmax = max(values)
    const xrange = xmax - xmin
    const xstep = xrange / bins
    const x = range(xmin, xmax, xstep)
    const y = []

    for (let i = 0; i < x.length; i++) {
      const count = values.filter(v => v >= x[i] && v < x[i] + xstep).length
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
    throw new MathError(
      "The `show` method must be overridden in a concrete class!"
    )
  }
}

module.exports = AbstractPlotter
