var conf = require('../conf.json'),
    logger = require('./logging.js');

exports = module.exports = new engine;

function engine() {

}

engine.prototype.render = function(entry) {
    logger.log('Rendering entry: ' + JSON.stringify(entry), 7);
    return entry;
}