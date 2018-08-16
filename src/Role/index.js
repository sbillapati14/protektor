import { contains, clone } from 'ramda';
import { InvalidPayloadTypeError } from '../Errors';
import { requiredParam } from '../utils';

const createRole = (roleData) => {
  let payload = {
    roleIdentifier: {},
    permissions: []
  };

  if (roleData) {
    payload = roleData;
  }

  if (!payload || !payload.roleIdentifier || !payload.permissions || !Array.isArray(payload.permissions)) {
    throw new InvalidPayloadTypeError();
  }

  const roleIdentifier = () => clone(payload.roleIdentifier);

  const hasPermission = ({
    action = requiredParam('action'),
    resource = requiredParam('resource')
  }) => contains({ action, resource, allowed: true }, payload.permissions);

  return Object.freeze({
    roleIdentifier,
    hasPermission
  });
};

export default createRole;
