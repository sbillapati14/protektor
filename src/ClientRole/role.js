const { requiredParam, checkPermission } = require('../utils');
const { InvalidPayloadTypeError } = require('../Errors');
const Permission = require('./permission');

module.exports = function Role() {
  let roleName = '';
  const rolePermissions = [];

  function createRole({
    name = requiredParam('name'),
    permissions = requiredParam('permissions')
  }) {
    roleName = name;

    if (!Array.isArray(permissions)) {
      throw new InvalidPayloadTypeError();
    }

    permissions.forEach((perm) => {
      rolePermissions.push(
        perm.isDisallowing
          ? Permission().forbid({
            action: perm.action,
            resource: perm.resource
          })
          : Permission().allow({
            action: perm.action,
            resource: perm.resource
          })
      );
    });

    return this;
  }

  function fromJSON(data) {
    if (!data || !data.name || !data.permissions || !Array.isArray(data.permissions)) {
      throw new InvalidPayloadTypeError();
    }

    roleName = data.name;

    data.permissions.forEach((perm) => {
      rolePermissions.push(
        perm.isDisallowing
          ? Permission().forbid({ action: perm.action, resource: perm.resource })
          : Permission().allow({ action: perm.action, resource: perm.resource })
      );
    });

    return this;
  }

  function hasPermission({
    action = requiredParam('action'),
    resource = requiredParam('resource')
  }) {
    if (roleName === 'root') {
      return true;
    }

    const permission = rolePermissions.find(
      perm => perm.action === action && perm.resource === resource
    );
    if (!permission) {
      return false;
    }

    return checkPermission({
      action,
      resource,
      roleName,
      permission
    });
  }

  return Object.freeze({
    createRole,
    fromJSON,
    hasPermission
  });
};
