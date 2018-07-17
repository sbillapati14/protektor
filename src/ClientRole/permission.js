const { requiredParam, getResourceName } = require('../utils');

module.exports = function Permission() {
  function allow({ action = requiredParam('action'), resource = requiredParam('resource') }) {
    return {
      action,
      resource: getResourceName(resource),
      isDisallowing: false
    };
  }

  function forbid({ action = requiredParam('action'), resource = requiredParam('resource') }) {
    return {
      action,
      resource: getResourceName(resource),
      isDisallowing: true
    };
  }

  return Object.freeze({
    allow,
    forbid
  });
};
