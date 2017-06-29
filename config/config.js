const devConfig = require('./config.development');
const prodConfig = require('./config.production');

var env = process.env.NODE_ENV || 'development';
var config = env === 'development' ? devConfig : prodConfig;

config.apiKeys = {
  xboxLiveAPIKey: '14e3935a4b916ef4d7ed6f9be186ea62b48a656d',
  h5APIKey: '4826b671afa84fbbba1fdc512ab41fc1'
}

module.exports = config;
