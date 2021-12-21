function isInBrowser() {
  return typeof window !== "undefined"
}

function valueMap(x, a, b, c, d) {
  return ((d - c) * (x - a)) / (b - a) + c
}

class Plot {
  static NODE_MODE = "node-mode"
  static BROWSER_MODE = "browser-mode"

  constructor() {
    const self = this
    self.instructions = []
    self.mode = isInBrowser() ? Plot.BROWSER_MODE : Plot.NODE_MODE
    self.left = -1
    self.right = 1
    self.top = 1
    self.bottom = -1
  }

  setBounds(xmin, xmax, ymin, ymax) {
    const self = this

    self.instructions.push({
      action: "set-bounds",
      data: { xmin, xmax, ymin, ymax },
    })

    return self
  }

  scatter(x, y) {
    const self = this

    self.instructions.push({
      action: "draw",
      type: "scatter",
      data: {
        x,
        y,
      },
    })

    return self
  }

  show() {
    const self = this

    // browser mode
    if (self.mode === Plot.BROWSER_MODE) {
      const width = 800
      const height = 600
      const padding = width / 10
      const canvas = document.createElement("canvas")
      canvas.width = width
      canvas.height = height
      document.body.appendChild(canvas)

      const context = canvas.getContext("2d")
      context.fillStyle = "rgb(245, 245, 245)"
      context.fillRect(0, 0, width, height)

      let lastAngle = 0
      const angleStep = 100

      self.instructions.forEach(instruction => {
        // bounds-setting instructions
        if (instruction.action === "set-bounds") {
          self.left = instruction.data.xmin
          self.right = instruction.data.xmax
          self.bottom = instruction.data.ymin
          self.top = instruction.data.ymax
        }

        // drawing instructions
        else if (instruction.action === "draw") {
          if (instruction.type === "scatter") {
            context.fillStyle = `hsl(${lastAngle}deg, 100%, 50%)`
            lastAngle += angleStep

            const x = instruction.data.x.map(v => {
              return valueMap(
                v,
                self.left,
                self.right,
                padding,
                width - padding
              )
            })

            const y = instruction.data.y.map(v => {
              return valueMap(
                v,
                self.bottom,
                self.top,
                height - padding,
                padding
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
    }

    // node mode
    else {
      const fs = require("fs")
      const { exec } = require("child_process")
      const express = require("express")
      const app = express()

      app.use("/", express.static("src/public", { extensions: ["html"] }))

      app.get("/get-instructions", (request, response) => {
        return response.send(JSON.stringify(self.instructions))
      })

      app.get("/quit", (request, response) => {
        response.send(null)
        listener.close()
      })

      const listener = app.listen(12345, () => {
        fs.copyFileSync("dist/js-plot-tools.js", "src/public/js-plot-tools.js")
        exec(`xdg-open http://localhost:12345`)
      })
    }

    return self
  }
}

if (typeof module !== "undefined") {
  module.exports = new Plot()
}

if (typeof window !== "undefined") {
  window.plot = new Plot()
}
