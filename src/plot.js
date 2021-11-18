const { isAString, isUndefined } = require("@jrc03c/js-math-tools")
const { exec } = require("child_process")
const express = require("express")
const path = require("path")

if (!String.prototype.replaceAll) {
  String.prototype.replaceAll = function (a, b) {
    const self = this
    return self.split(a).join(b)
  }
}

class Plot {
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

  draw(type, data) {
    const self = this

    if (self.isInBrowser) {
      self.container.appendChild(self.canvas)
    } else {
      const app = express()

      app.use(
        "/",
        express.static(path.join(__dirname, "public"), { extensions: ["html"] })
      )

      app.get("/data", (request, response) => {
        response.send({ type, data })
        listener.close()
      })

      const listener = app.listen(12345)
      exec("xdg-open http://localhost:12345")
      return self
    }

    return self
  }
}

module.exports = Plot
