const { requiredParam, getResourceName } = require('../utils');

module.exports = function createRoles() {
  const roles = [];

  function allow({
    action = requiredParam('action'),
    resource = requiredParam('resource'),
    roleName = requiredParam('roleName')
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
        isDisallowing: false
      };
      role.permissions.push(permission);
    }
    permission.action = action;
    permission.resource = resourceName;
  }

  function forbid() {}

  function hasPermissions() {}

  function removePermission() {}

  function rolesByName() {}

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
    removeRole,
    fromJSON,
    toJSON
  });
};
