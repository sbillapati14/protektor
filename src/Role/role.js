const { requiredParam, checkPermission } = require('../utils');
const { InvalidPayloadTypeError } = require('../Errors');
const Permission = require('./permission');

module.exports = function Role({
  name = requiredParam('name'),
  permissions = requiredParam('permissions')
}) {
  const roleName = name;
  const rolePermissions = [];
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
    hasPermission
  });
};
