// model-resource access controller
const { requiredParam, getResourceName, getModelName } = require('../utils');

module.exports = function MRAC(storeBackend) {
  let store = storeBackend;

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

  function findMapping(resource = requiredParam('resource')) {
    return store.findModelResourceMap(resource);
  }

  function useStore(newStore) {
    store = newStore;
  }

  return Object.freeze({
    addModelResourceMap,
    removeModelResourceMap,
    findMapping,
    useStore
  });
};
