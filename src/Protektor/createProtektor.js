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
    roleName = requiredParam('roleName')
  }) => getAdapter().insertAllow(action, getResourceName(resource), roleName);

  const forbid = ({
    action = requiredParam('action'),
    resource = requiredParam('resource'),
    roleName = requiredParam('roleName')
  }) => getAdapter().insertForbid(action, getResourceName(resource), roleName);

  const hasModel = ({
    modelName = requiredParam('modelName'),
    roleName = requiredParam('roleName')
  }) => getAdapter().findModel(modelName, roleName);

  const getModel = ({
    modelName = requiredParam('modelName'),
    roleName = requiredParam('roleName'),
    modelTransformCallback = requiredParam('modelTransformCallback')
  }) => {
    const model = getAdapter().findModel(modelName, roleName);
    return modelTransformCallback(model);
  };

  const hasPermission = ({
    action = requiredParam('action'),
    resource = requiredParam('resource'),
    roleName = requiredParam('roleName')
  }) => getAdapter().hasPermission(action, resource, roleName);

  const allResourceNames = () => getAdapter().findAllResourceNames();

  const allRoles = () => getAdapter().findAllRoles();

  const roleToJSON = roleName => getAdapter().findRole(roleName);

  return Object.freeze({
    registerAdapter,
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
