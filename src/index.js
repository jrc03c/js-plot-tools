const NodePlotter = require("./node-plotter.js")
const BrowserPlotter = require("./browser-plotter.js")

if (typeof module !== "undefined") {
  module.exports = {
    BrowserPlotter,
    NodePlotter,

    dump() {
      if (typeof window !== "undefined") {
        window.plot = new BrowserPlotter()
        window.Plotter = BrowserPlotter
      } else {
        global.plot = new NodePlotter()
        global.Plotter = NodePlotter
      }
    },
  }
}

if (typeof window !== "undefined") {
  window.plot = new BrowserPlotter()
  window.Plotter = BrowserPlotter
}
