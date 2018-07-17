const createRoles = require('./Roles');
const createMemstore = require('./Store/MemStore');
const { Role, Permission } = require('./ClientRole');
const { HasPermission } = require('./React/HasPermission');

module.exports = {
  Roles: createRoles(),
  createMemstore,
  Role,
  Permission,
  HasPermission
};
