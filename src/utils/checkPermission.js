const { requiredParam } = require('../utils');

function checkPermission({
  action = requiredParam('action'),
  resource = requiredParam('resource'),
  roleName = requiredParam('roleName'),
  permission = requiredParam('permission')
}) {
  if (roleName === 'root') {
    // root can do anything
    return true;
  }

  if (permission.action !== action || permission.resource !== resource) {
    return false;
  }

  if (!permission.isDisallowing) {
    // role has permission for this action on this resource
    return true;
  }

  return false;
}

module.exports = checkPermission;
