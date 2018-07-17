const { requiredParam, getResourceName, checkPermission } = require('../utils');
const createMemstore = require('../Store/MemStore');
const MRAC = require('../MRAC');

module.exports = function createRoles() {
  let store = createMemstore();
  const mrac = MRAC(store);

  function createPermission({
    action, resource, roleName, isDisallowing
  }) {
    const resourceName = getResourceName(resource);
    store.addRole(roleName);
    store.addPermission(action, resourceName, isDisallowing, roleName);
  }

  function allow({
    action = requiredParam('action'),
    resource = requiredParam('resource'),
    roleName = requiredParam('roleName')
  }) {
    // if (typeof action === 'string') {
    //
    // } else if (Array.isArray(action)) {
    //
    // } else {
    //
    // }
    createPermission({
      action,
      resource,
      roleName,
      isDisallowing: false
    });
  }

  function forbid({
    action = requiredParam('action'),
    resource = requiredParam('resource'),
    roleName = requiredParam('roleName')
  }) {
    createPermission({
      action,
      resource,
      roleName,
      isDisallowing: true
    });
  }

  function hasPermissions({
    action = requiredParam('action'),
    resource = requiredParam('resource'),
    roleName = requiredParam('roleName')
  }) {
    if (roleName === 'root') {
      // root can do anything
      return true;
    }

    let permission;
    try {
      permission = store.getPermission(action, resource, roleName);
    } catch (error) {
      // role has no permissions for this action or role
      return false;
    }

    return checkPermission({
      action,
      resource,
      roleName,
      permission
    });
  }

  function removePermission({
    action = requiredParam('action'),
    resource = requiredParam('resource'),
    roleName = requiredParam('roleName')
  }) {
    store.removePermission(action, resource, roleName);
  }

  function roleByName(roleName) {
    return store.getRoleByName(roleName);
  }

  function allRoles() {
    return store.allRoles();
  }

  function removeRole(roleName) {
    store.removeRole(roleName);
  }

  function addModelResourceMap({
    resource = requiredParam('resource'),
    model = requiredParam('model')
  }) {
    mrac.addModelResourceMap({ resource, model });
  }

  function removeModelResourceMap({
    resource = requiredParam('resource'),
    model = requiredParam('model')
  }) {
    mrac.removeModelResourceMap({ resource, model });
  }

  function findMapping(resource = requiredParam('resource')) {
    return mrac.findMapping(resource);
  }

  function fromJSON(data) {
    return store.fromJSON({
      rolesData: data.roles,
      modelResourceAccessMapData: data.modelResourceAccessMap
    });
  }

  function toJSON() {
    return store.toJSON();
  }

  function useStore(newStore) {
    store = newStore;
    mrac.useStore(store);
  }

  return Object.freeze({
    allow,
    forbid,
    hasPermissions,
    removePermission,
    roleByName,
    allRoles,
    removeRole,
    addModelResourceMap,
    removeModelResourceMap,
    findMapping,
    fromJSON,
    toJSON,
    useStore
  });
};
