const NodePlotter = require("./node-plotter.js")

module.exports = {
  plot: new NodePlotter(),

  dump() {
    global["plot"] = new NodePlotter()
  },
}
