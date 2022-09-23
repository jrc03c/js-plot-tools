const { exec } = require("child_process")
const AbstractPlotter = require("./abstract-plotter.js")
const fs = require("fs")
const makeKey = require("@jrc03c/make-key")
const path = require("path")

const tempDir = path.join(__dirname, "temp")

if (fs.existsSync(tempDir)) {
  fs.rmSync(tempDir, { recursive: true, force: true })
}

fs.mkdirSync(tempDir)

class NodePlotter extends AbstractPlotter {
  constructor() {
    super()
    const self = this
    self.browserCommand = "xdg-open $FILE"
  }

  show() {
    const self = this

    const template = fs.readFileSync(
      path.join(__dirname, "public/index.html"),
      "utf8"
    )

    const minifiedScript = fs.readFileSync(
      path.join(__dirname, "../dist/js-plot-tools.js"),
      "utf8"
    )

    const out = template
      .replace("<% minified-script %>", minifiedScript)
      .replace("<% obj %>", self.dehydrate())

    const key = makeKey(8)
    const outfile = path.join(tempDir, `${key}.html`)
    fs.writeFileSync(outfile, out, "utf8")

    exec(
      `${self.browserCommand.replace("$FILE", `"file://${outfile}"`)}`,
      (error, stdout, stderr) => {
        if (error) console.log(error)
        if (stderr.trim().length > 0) console.log(stderr)
        console.log(stdout)
      }
    )

    return self
  }
}

module.exports = NodePlotter
