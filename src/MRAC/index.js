// model-resource access controller
const { requiredParam, getResourceName, getModelName } = require('../utils');

module.exports = function MRAC(store) {
  function addModelResourceMap({
    resource = requiredParam('resource'),
    model = requiredParam('model')
  }) {
    store.addModelResourceMap(getResourceName(resource), getModelName(model));
  }

  function removeModelResourceMap({
    resource = requiredParam('resource'),
    model = requiredParam('model')
  }) {
    store.removeModelResourceMap(getResourceName(resource), getModelName(model));
  }

  return Object.freeze({
    addModelResourceMap,
    removeModelResourceMap
  });
};
