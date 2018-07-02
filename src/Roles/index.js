const requiredParam = require('../utils/requiredParam');

module.exports = function createRoles() {
  const roles = [];

  function allow({
    action = requiredParam('action'),
    resource = requiredParam('resource'),
    roleName = requiredParam('roleName')
  }) {
    let role = roles.find(aRole => aRole.name);
    if (!role) {
      role = {
        name: roleName,
        permissions: []
      };
      roles.push(role);
    }

    let permission = role.permissions.find(
      aPermission => aPermission.action === action && aPermission.resource === resource
    );
    if (!permission) {
      permission = {
        action: '',
        resource: ''
      };
      role.permissions.push(permission);
    }
    permission.action = action;
    permission.resource = resource;
  }

  function forbid() {}

  function hasPermissions() {}

  function removePermission() {}

  function rolesByName() {}

  function removeRole() {}

  function fromJSON() {}

  function toJSON() {}

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
