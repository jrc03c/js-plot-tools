const { plot } = require(__dirname)
plot.browserCommand = "firefox $FILE"
global.plot = plot
