import createRole from '../Role';

const createRoleBuilder = () => {
  const emptyRole = () => createRole();

  const fromJSON = role => createRole(role);

  return Object.freeze({
    emptyRole,
    fromJSON
  });
};

export default createRoleBuilder;
