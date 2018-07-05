const { requiredParam, getResourceName } = require('../utils');

module.exports = function createRoles() {
  const roles = [];

  function createPermission({
    action, resource, roleName, isDisallowing
  }) {
    const resourceName = getResourceName(resource);
    let role = roles.find(aRole => aRole.name === roleName);
    if (!role) {
      role = {
        name: roleName,
        permissions: []
      };
      roles.push(role);
    }

    let permission = role.permissions.find(
      aPermission => aPermission.action === action && aPermission.resource === resourceName
    );
    if (!permission) {
      permission = {
        action: '',
        resource: '',
        isDisallowing
      };
      role.permissions.push(permission);
    }
    permission.action = action;
    permission.resource = resourceName;
    permission.isDisallowing = isDisallowing;
  }

  function allow({
    action = requiredParam('action'),
    resource = requiredParam('resource'),
    roleName = requiredParam('roleName')
  }) {
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

  function hasPermissions(action, resource, roleName) {
    if (roleName === 'root') {
      // root can do anything
      return true;
    }

    const role = roles.find(aRole => aRole.name === roleName);
    if (!role) {
      // role does not exist so deny access
      return false;
    }

    const permission = role.permissions.find(
      aPermission => aPermission.action === action && aPermission.resource === resource
    );
    if (!permission) {
      // role has no permissions for this action or role
      return false;
    }

    if (!permission.isDisallowing) {
      // role has permission for this action on this resource
      return true;
    }

    return false;
  }

  function removePermission() {}

  function rolesByName() {}

  function allRoles() {
    return roles.map(aRole => aRole.name);
  }

  function removeRole() {}

  function fromJSON() {}

  function toJSON() {
    return roles;
  }

  return Object.freeze({
    allow,
    forbid,
    hasPermissions,
    removePermission,
    rolesByName,
    allRoles,
    removeRole,
    fromJSON,
    toJSON
  });
};
