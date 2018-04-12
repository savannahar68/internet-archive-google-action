/**
 * Setup application
 */
const axios = require('axios');
const mustache = require('mustache');

const packageJSON = require('../package.json');

const appConfig = require('./config');
const mathjsExtensions = require('./mathjs');
const whichPlatform = require('./platform/which');
const {debug, warning} = require('./utils/logger')('ia:axio:interceptions');

module.exports = () => {
  mathjsExtensions.patch();

  const userAgent = mustache.render(
    appConfig.request.userAgent,
    Object.assign({}, packageJSON, {platform: whichPlatform()})
  );

  // patch requests
  axios.interceptors.request.use((config) => {
    config.headers['user-agent'] = userAgent;
    debug(`${config.method.toUpperCase()} ${config.url}`);
    return config;
  }, (error) => {
    const config = error.config;
    if (config) {
      warning(`fail request ${config.method.toUpperCase()} ${config.url}`, error);
    } else {
      warning(`fail`, error);
    }
    return Promise.reject(error);
  });
};
