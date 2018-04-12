const {debug} = require('./')('ia:start');
const packageJSON = require('../../../package.json');

module.exports = (actionsMap) => {
  const actionNames = Array.from(actionsMap.keys())
    .map(name => `"${name}"`)
    .join(', ');

  debug('[Start]');
  debug('-----------------------------------------');
  debug(`Node.js Version: ${process.version}`);
  debug('-----------------------------------------');
  debug(`DialogFlow App Version: ${packageJSON.version}`);
  debug('-----------------------------------------');
  debug(`We can handle actions: ${actionNames}`);
};
