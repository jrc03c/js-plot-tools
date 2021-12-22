const AbstractPlotter = require("./abstract-plotter.js")
const { min, max } = require("@jrc03c/js-math-tools")

function valueMap(x, a, b, c, d) {
  return ((d - c) * (x - a)) / (b - a) + c
}

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

  static hydrate(obj) {
    const plot = new BrowserPlotter()
    plot.instructions = obj.instructions
    plot.shouldDrawAxes = obj.shouldDrawAxes
    plot.shouldSetBoundsAutomatically = obj.shouldSetBoundsAutomatically
    return plot
  }

  show() {
    const self = this

    const { width, height } = self.element.getBoundingClientRect()
    const padding = width / 10
    const canvas = document.createElement("canvas")
    canvas.width = width
    canvas.height = height
    self.element.appendChild(canvas)

    const context = canvas.getContext("2d")
    context.fillStyle = "rgb(245, 245, 245)"
    context.fillRect(0, 0, width, height)

    // set bounds automatically
    if (self.shouldSetBoundsAutomatically) {
      const drawInstructions = self.instructions.filter(
        i => i.action === "draw"
      )

      const allXValues = drawInstructions.map(i => i.data.x || [])
      const allYValues = drawInstructions.map(i => i.data.y || [])

      self.left = min(allXValues)
      self.right = max(allXValues)
      self.bottom = min(allYValues)
      self.top = max(allYValues)
    }

    // set bounds manually
    else {
      const setBoundsInstructions = self.instructions.filter(
        i => i.action === "set-bounds"
      )

      const instruction =
        setBoundsInstructions[setBoundsInstructions.length - 1]

      self.left = instruction.data.xmin
      self.right = instruction.data.xmax
      self.bottom = instruction.data.ymin
      self.top = instruction.data.ymax
    }

    // draw axes
    if (self.shouldDrawAxes) {
      context.strokeStyle = "black"
      context.lineWidth = 1

      const x = valueMap(
        0,
        self.left,
        self.right,
        self.padding,
        width - self.padding
      )

      const y = valueMap(
        0,
        self.bottom,
        self.top,
        height - self.padding,
        self.padding
      )

      context.beginPath()
      context.moveTo(x, padding)
      context.lineTo(x, height - padding)
      context.moveTo(padding, y)
      context.lineTo(width - padding, y)
      context.stroke()
    }

    // run all instructions
    self.instructions.forEach(instruction => {
      // draw
      if (instruction.action === "draw") {
        // scatter plots
        if (instruction.type === "scatter") {
        }
      }
    })

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
