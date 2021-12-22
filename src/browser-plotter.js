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
    plot.padding = obj.padding
    return plot
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
      console.log("drawing axes...")
      context.strokeStyle = "black"
      context.lineWidth = 2

      const xZero = valueMap(
        0,
        self.left,
        self.right,
        self.padding,
        width - self.padding
      )

      const yZero = valueMap(
        0,
        self.bottom,
        self.top,
        height - self.padding,
        self.padding
      )

      context.beginPath()
      context.moveTo(xZero, self.padding)
      context.lineTo(xZero, height - self.padding)
      context.moveTo(self.padding, yZero)
      context.lineTo(width - self.padding, yZero)
      context.stroke()
    }

    // set colors
    let lastAngle = 0
    const angleStep = 110

    // run all instructions
    self.instructions.forEach(instruction => {
      // draw
      if (instruction.action === "draw") {
        // scatter plots
        if (instruction.type === "scatter") {
          context.fillStyle = `hsl(${lastAngle}deg, 100%, 50%)`
          lastAngle += angleStep

          const x = instruction.data.x.map(v => {
            return valueMap(
              v,
              self.left,
              self.right,
              self.padding,
              width - self.padding
            )
          })

          const y = instruction.data.y.map(v => {
            return valueMap(
              v,
              self.bottom,
              self.top,
              height - self.padding,
              self.padding
            )
          })

          for (let i = 0; i < x.length; i++) {
            context.beginPath()
            context.arc(x[i], y[i], 2, 0, Math.PI * 2, false)
            context.fill()
          }
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
