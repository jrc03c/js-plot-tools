const BrowserPlotter = require("./browser-plotter.js")
const NodePlotter = require("./node-plotter.js")

if (typeof module !== "undefined") {
  module.exports = {
    plot: new NodePlotter(),
    Plotter: NodePlotter,
  }
}

if (typeof window !== "undefined") {
  window.plot = new BrowserPlotter()
  window.Plotter = BrowserPlotter
}
