const { isAString, isUndefined } = require("@jrc03c/js-math-tools")

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
      self.isInBrowser = true
    }

    return self
  }

  show(data) {
    const self = this

    if (self.isInBrowser) {
      self.container.appendChild(self.canvas)
    } else {
      // ...
    }

    return self
  }
}

module.exports = Plotter
