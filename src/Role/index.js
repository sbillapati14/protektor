import {
  find,
  where,
  clone,
  equals
} from 'ramda';
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
  }) => !!find(where({
    action: equals(action),
    resource: equals(resource),
    allowed: equals(true)
  }), payload.permissions);

  const toJSON = () => clone(payload);

  return Object.freeze({
    roleIdentifier,
    hasPermission,
    toJSON
  });
};

export default createRole;
