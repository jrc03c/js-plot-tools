const AbstractPlotter = require("./abstract-plotter.js")
const { valueMap } = require("./utils.js")
const {
  min,
  max,
  log,
  pow,
  floor,
  ceil,
  range,
  abs,
  clamp,
} = require("@jrc03c/js-math-tools")

function getTickSize(xrange) {
  const xpow10 = floor(log(abs(xrange)) / log(10))
  const a = pow(10, xpow10)
  const b = a / 2
  const c = b / 2

  let closest = a
  let score = Infinity
  const options = [a, b, c]

  options.forEach(v => {
    const s = pow(xrange / v - 10, 2)

    if (s < score) {
      score = s
      closest = v
    }
  })

  return closest
}

function getMultiplesOfXBetweenAAndB(x, a, b) {
  if (b < a) {
    const buffer = a
    a = b
    b = buffer
  }

  const start = ceil(a / x) * x
  const stop = floor(b / x) * x
  return range(start - x, stop + x * 2, x).filter(v => v !== 0)
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
    plot.shouldDrawAxisTicks = obj.shouldDrawAxisTicks
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

    if (self.instructions.length === 0) {
      return self
    }

    // get all points (for bounds setting and tick mark drawing)
    const drawInstructions = self.instructions
      .filter(i => i.action === "draw")
      .map(i => {
        if (i.type === "hist") {
          return {
            data: {
              x: i.data.x,
              y: [0, max(i.data.y)],
            },
          }
        } else {
          return i
        }
      })

    const allXValues = drawInstructions.map(i => i.data.x || [])
    const allYValues = drawInstructions.map(i => i.data.y || [])

    // set bounds automatically
    if (self.shouldSetBoundsAutomatically) {
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

      if (self.shouldDrawAxisTicks) {
        const xmin = min(allXValues)
        const xmax = max(allXValues)
        const xrange = xmax - xmin

        const xtick = getTickSize(xrange)
        const xticks = getMultiplesOfXBetweenAAndB(xtick, xmin, xmax)

        const ymin = min(allYValues)
        const ymax = max(allYValues)
        const yrange = ymax - ymin

        const ytick = getTickSize(yrange)
        const yticks = getMultiplesOfXBetweenAAndB(ytick, ymin, ymax)

        context.fillStyle = "black"
        context.font = "10px monospace"
        context.textAlign = "center"
        context.textBaseline = "middle"

        xticks.forEach(tick => {
          const x = valueMap(
            tick,
            self.left,
            self.right,
            self.padding,
            width - self.padding
          )

          const y = clamp(
            valueMap(
              0,
              self.bottom,
              self.top,
              height - self.padding,
              self.padding
            ),
            self.padding,
            height - self.padding
          )

          context.beginPath()
          context.moveTo(x, y - 4)
          context.lineTo(x, y + 4)
          context.stroke()

          context.fillText(tick.toString(), x, y - 10)
        })

        context.textAlign = "left"

        yticks.forEach(tick => {
          const x = clamp(
            valueMap(
              0,
              self.left,
              self.right,
              self.padding,
              width - self.padding
            ),
            self.padding,
            width - self.padding
          )

          const y = valueMap(
            tick,
            self.bottom,
            self.top,
            height - self.padding,
            self.padding
          )

          context.beginPath()
          context.moveTo(x - 4, y)
          context.lineTo(x + 4, y)
          context.stroke()

          context.fillText(tick.toString(), x + 10, y)
        })
      }
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
          context.fillStyle = `hsl(${lastAngle}deg, 100%, 33%)`
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

        // line plots
        else if (instruction.type === "line") {
          context.strokeStyle = `hsl(${lastAngle}deg, 100%, 50%)`
          context.lineWidth = 2
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

          context.beginPath()

          for (let i = 0; i < x.length - 1; i++) {
            context.moveTo(x[i], y[i])
            context.lineTo(x[i + 1], y[i + 1])
          }

          context.stroke()
        }

        // histograms
        else if (instruction.type === "hist") {
          context.fillStyle = `hsla(${lastAngle}deg, 100%, 50%, 0.5)`
          context.strokeStyle = "black"
          lastAngle += angleStep

          const w = valueMap(
            instruction.data.x[1] - instruction.data.x[0],
            0,
            self.right - self.left,
            0,
            width - 2 * self.padding
          )

          console.log("w:", w)

          for (let i = 0; i < instruction.data.x.length; i++) {
            const x = valueMap(
              instruction.data.x[i],
              self.left,
              self.right,
              self.padding,
              width - self.padding
            )

            const h = valueMap(
              instruction.data.y[i],
              0,
              max(instruction.data.y),
              0,
              height - 2 * self.padding
            )

            context.fillRect(x, height - self.padding - h, w, h)
            context.strokeRect(x, height - self.padding - h, w, h)
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
