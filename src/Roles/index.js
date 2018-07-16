const { requiredParam, getResourceName, checkPermission } = require('../utils');
const createMemstore = require('../Store/MemStore');

module.exports = function createRoles() {
  let store = createMemstore();

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
  }

  return Object.freeze({
    allow,
    forbid,
    hasPermissions,
    removePermission,
    roleByName,
    allRoles,
    removeRole,
    fromJSON,
    toJSON,
    useStore
  });
};
