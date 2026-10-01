// THE END headless file list (same order as end/index.html)
module.exports = require('./swvm').filter(f => f !== 'stw/swmain').concat(['end/endcore', 'end/endrewind', 'end/endstory', 'end/endgen', 'end/endmain']);
