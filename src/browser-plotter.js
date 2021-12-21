const AbstractPlotter = require("./abstract-plotter.js")

class BrowserPlotter extends AbstractPlotter {
  constructor(element) {
    super()

    const self = this

    if (typeof element === "string") {
      self.element = document.querySelector(element)
    } else if (element instanceof HTMLElement) {
      self.element = element
    } else {
      self.element = document.body
    }
  }

  show() {
    const self = this

    const { width, height } = self.element.getBoundingClientRect()
    const canvas = document.createElement("canvas")
    canvas.width = width
    canvas.height = height
    self.element.appendChild(canvas)

    const context = canvas.getContext("2d")
    context.fillStyle = "rgb(245, 245, 245)"
    context.fillRect(0, 0, width, height)

    return self
  }
}

if (typeof module !== "undefined") {
  module.exports = BrowserPlotter
}

if (typeof window !== "undefined") {
  window.plot = new BrowserPlotter()
  window.Plotter = BrowserPlotter
}
