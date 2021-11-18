const { isAString, isUndefined } = require("@jrc03c/js-math-tools")
const fs = require("fs")
const makeKey = require("@jrc03c/make-key")
const { exec } = require("child_process")

if (!String.prototype.replaceAll) {
  String.prototype.replaceAll = function (a, b) {
    const self = this
    return self.split(a).join(b)
  }
}

class Plotter {
  constructor(element) {
    const self = this

    // if browser, draw to canvas
    if (typeof window !== "undefined") {
      self.isInBrowser = true

      const container = (() => {
        if (isUndefined(element)) {
          const div = document.createElement("div")
          div.id = "container"
          document.body.appendChild(div)
          return div
        } else {
          if (isAString) {
            const out = document.querySelector(element)
            out.innerHTML = ""
            return out
          } else {
            element.innerHTML = ""
            return element
          }
        }
      })()

      const canvas = document.createElement("canvas")
      const containerRect = container.getBoundingClientRect()
      const width = containerRect.width
      const height = containerRect.height
      canvas.width = width
      canvas.height = height

      self.container = container
      self.canvas = canvas
    }

    // else if node:
    // - inject data into html template
    // - open rendered html file in browser
    else {
      self.isInBrowser = false
    }

    return self
  }

  show(data) {
    const self = this

    if (self.isInBrowser) {
      self.container.appendChild(self.canvas)
    } else {
      const template = fs.readFileSync("src/template.html", "utf8")
      const plotScriptMin = fs.readFileSync("dist/js-plot-tools.js", "utf8")

      const out = template
        .replaceAll("$data", JSON.stringify(data))
        .replaceAll("$plotScriptMin", plotScriptMin)

      if (!fs.existsSync("temp")) {
        fs.mkdirSync("temp")
      }

      const key = makeKey(32)
      fs.writeFileSync("temp/" + key + ".html", out, "utf8")
      exec(`xdg-open ${"temp/" + key + ".html"}`)
    }

    return self
  }
}

module.exports = Plotter
