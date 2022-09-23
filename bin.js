const { plot } = require(__dirname)
plot.setBrowserCommand("firefox $FILE")
global.plot = plot
