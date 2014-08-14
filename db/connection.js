var mongoose = require('mongoose');
var config = null;

try {
  config = require('../config.json');
}
catch(err) { }

var mongoString = null;

if (config) {
  mongoString = config.mongoString;
}

mongoose.connect(mongoString || 'mongodb://admin:SnappyApp1@kahana.mongohq.com:10010/paytime');
module.exports = mongoose;