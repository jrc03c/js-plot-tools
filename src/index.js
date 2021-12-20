function isInBrowser() {
  return typeof window !== "undefined"
}

class Plot {
  static NODE_MODE = "node-mode"
  static BROWSER_MODE = "browser-mode"

  constructor() {
    const self = this
    self.instructions = []
    self.mode = isInBrowser() ? Plot.BROWSER_MODE : Plot.NODE_MODE
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
      const canvas = document.createElement("canvas")
      canvas.width = width
      canvas.height = height
      document.body.appendChild(canvas)

      const context = canvas.getContext("2d")
      context.fillStyle = "red"
      context.fillRect(0, 0, width, height)
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
        process.exit(0)
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
