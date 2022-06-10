const AbstractPlotter = require("./abstract-plotter.js")
const fs = require("fs")
const { exec } = require("child_process")
const path = require("path")
const makeKey = require("@jrc03c/make-key")
const tempDir = path.join(__dirname, "temp")

if (fs.existsSync(tempDir)) {
  fs.rmSync(tempDir, { recursive: true, force: true })
}

fs.mkdirSync(tempDir)

class NodePlotter extends AbstractPlotter {
  constructor() {
    super()
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

    exec(`xdg-open "file://${outfile}"`, (error, stdout, stderr) => {
      if (error) console.log(error)
      if (stderr.trim().length > 0) console.log(stderr)
      console.log(stdout)
    })

    return self
  }
}

module.exports = NodePlotter
