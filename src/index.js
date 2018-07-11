const createRoles = require('./Roles');
const createMemstore = require('./Store/MemStore');

module.exports = {
  Roles: createRoles(),
  createMemstore
};
