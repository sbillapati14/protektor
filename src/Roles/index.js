const { requiredParam, getResourceName } = require('../utils');
const { RoleNotFoundError, PermissionNotFoundError } = require('../Errors');

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

  function hasPermissions({
    action = requiredParam('action'),
    resource = requiredParam('resource'),
    roleName = requiredParam('roleName')
  }) {
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

  function removePermission({
    action = requiredParam('action'),
    resource = requiredParam('resource'),
    roleName = requiredParam('roleName')
  }) {
    const requestedRole = roles.find(aRole => aRole.name === roleName);
    if (!requestedRole) {
      throw new RoleNotFoundError(roleName);
    }

    const requestedPermissionIndex = requestedRole.permissions.findIndex(
      aPerm => aPerm.action === action && aPerm.resource === resource
    );

    if (requestedPermissionIndex === -1) {
      throw new PermissionNotFoundError(action, resource);
    }

    requestedRole.permissions.splice(requestedPermissionIndex, 1);
  }

  function rolesByName(roleName) {
    return roles.find(aRole => aRole.name === roleName);
  }

  function allRoles() {
    return roles.map(aRole => aRole.name);
  }

  function removeRole(roleName) {
    const roleIndex = roles.findIndex(aRole => aRole.name === roleName);
    if (roleIndex === -1) {
      throw new RoleNotFoundError(roleName);
    }

    roles.splice(roleIndex, 1);
  }

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
