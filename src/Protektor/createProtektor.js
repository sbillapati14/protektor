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

  const removePermission = ({
    action = requiredParam('action'),
    resource = requiredParam('resource'),
    roleIdentifier = requiredParam('roleIdentifier')
  }) => getAdapter().removePermission(action, getResourceName(resource), roleIdentifier);

  const removeRole = roleIdentifier => getAdapter().removeRole(roleIdentifier);

  const hasModel = ({
    modelName = requiredParam('modelName'),
    roleIdentifier = requiredParam('roleIdentifier')
  }) => getAdapter().hasModel(modelName, roleIdentifier);

  const getModel = async ({
    modelName = requiredParam('modelName'),
    roleIdentifier = requiredParam('roleIdentifier'),
    modelTransformCallback = requiredParam('modelTransformCallback')
  }) => {
    const model = await getAdapter().findModel(modelName, roleIdentifier);
    modelTransformCallback(model);
    return Promise.resolve();
  };

  const hasPermission = ({
    action = requiredParam('action'),
    resource = requiredParam('resource'),
    roleIdentifier = requiredParam('roleIdentifier')
  }) => getAdapter().hasPermission(action, resource, roleIdentifier);

  const allResourceNames = () => getAdapter().findAllResourceNames();

  const filterRoles = (filterComparator, roleIdentifier) => getAdapter().filterRoles(filterComparator, roleIdentifier);

  const roleToJSON = roleIdentifier => getAdapter().findRole(roleIdentifier);

  return Object.freeze({
    registerAdapter,
    registerRoleIdentifierComparator,
    resourceModels,
    allow,
    forbid,
    removePermission,
    removeRole,
    hasModel,
    getModel,
    hasPermission,
    allResourceNames,
    filterRoles,
    roleToJSON
  });
};

export default createProtektor;
