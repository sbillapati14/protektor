import {
  join,
  map,
  toLower,
  values,
  compose
} from 'ramda';
import { InvalidOrMissingAdapterError, InvalidResourceTypeError } from '../Errors';
import { requiredParam, getResourceName } from '../utils';

const createProtektor = () => {
  let adapter;

  const getAdapter = () => {
    if (!adapter) {
      throw new InvalidOrMissingAdapterError();
    }

    return adapter;
  };

  const registerAdapter = (newAdapter) => {
    adapter = newAdapter;
    adapter.registerRoleIdentifierComparator(compose(
      join('-'),
      map(word => toLower(word)),
      values
    ));
  };

  const registerRoleIdentifierComparator = (predicate) => {
    adapter.registerRoleIdentifierComparator(predicate);
  };

  const resourceModels = (resource, dataModel) => {
    const adapt = getAdapter();

    if (!dataModel) {
      // return data models for this resourceName
      return adapt.findDataModels(getResourceName(resource));
    }

    if (!resource) {
      throw new InvalidResourceTypeError();
    }

    let models = dataModel;
    if (!Array.isArray(dataModel)) {
      models = [dataModel];
    }

    return adapt.insertDataModels(getResourceName(resource), models);
  };

  const allow = ({
    action = requiredParam('action'),
    resource = requiredParam('resource'),
    roleIdentifier = requiredParam('roleIdentifier')
  }) => getAdapter().insertAllow(action, getResourceName(resource), roleIdentifier);

  const forbid = ({
    action = requiredParam('action'),
    resource = requiredParam('resource'),
    roleIdentifier = requiredParam('roleIdentifier')
  }) => getAdapter().insertForbid(action, getResourceName(resource), roleIdentifier);

  const hasModel = ({
    modelName = requiredParam('modelName'),
    roleIdentifier = requiredParam('roleIdentifier')
  }) => getAdapter().findModel(modelName, roleIdentifier);

  const getModel = ({
    modelName = requiredParam('modelName'),
    roleIdentifier = requiredParam('roleIdentifier'),
    modelTransformCallback = requiredParam('modelTransformCallback')
  }) => {
    const model = getAdapter().findModel(modelName, roleIdentifier);
    return modelTransformCallback(model);
  };

  const hasPermission = ({
    action = requiredParam('action'),
    resource = requiredParam('resource'),
    roleIdentifier = requiredParam('roleIdentifier')
  }) => getAdapter().hasPermission(action, resource, roleIdentifier);

  const allResourceNames = () => getAdapter().findAllResourceNames();

  const allRoles = () => getAdapter().findAllRoles();

  const roleToJSON = roleName => getAdapter().findRole(roleName);

  return Object.freeze({
    registerAdapter,
    registerRoleIdentifierComparator,
    resourceModels,
    allow,
    forbid,
    hasModel,
    getModel,
    hasPermission,
    allResourceNames,
    allRoles,
    roleToJSON
  });
};

export default createProtektor;
