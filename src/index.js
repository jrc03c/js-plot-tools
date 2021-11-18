const plot = {
  bar: require("./bar.js"),
  hist: require("./hist.js"),
  line: require("./line.js"),
  pie: require("./pie.js"),
  scatter: require("./scatter.js"),
}

try {
  module.exports = plot
} catch (e) {}

try {
  window.JSPlotTools = plot
} catch (e) {}
