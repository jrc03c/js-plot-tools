const { plot } = require(__dirname)
plot.browserCommand = "xdg-open $FILE"
global.plot = plot
