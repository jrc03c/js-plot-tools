const AbstractPlotter = require("./abstract-plotter.js")
const fs = require("fs")
const { exec } = require("child_process")
const express = require("express")

class NodePlotter extends AbstractPlotter {
  constructor() {
    super()
  }

  show() {
    const self = this
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

    return self
  }
}

module.exports = NodePlotter
