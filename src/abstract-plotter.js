class AbstractPlotter {
  constructor() {
    const self = this
    self.instructions = []
    self.shouldDrawAxes = true
    self.shouldSetBoundsAutomatically = true
    self.padding = 0
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

  show() {
    throw new Error("The `show` method must be overridden in a concrete class!")
  }
}

module.exports = AbstractPlotter
