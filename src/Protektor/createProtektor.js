import { InvalidOrMissingAdapterError, InvalidResourceTypeError } from '../Errors';
import { requiredParam } from '../utils';

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

  const resource = (resourceName, dataModel) => {
    const adapt = getAdapter();

    if (!dataModel) {
      // return data models for this resourceName
      return adapt.findDataModels(resourceName);
    }

    if (!resourceName) {
      throw new InvalidResourceTypeError();
    }

    let models = dataModel;
    if (!Array.isArray(dataModel)) {
      models = [dataModel];
    }

    return adapt.insertDataModels(resourceName, models);
  };

  const allow = ({
    action = requiredParam('action'),
    resourceName = requiredParam('resourceName'),
    roleName = requiredParam('roleName')
  }) => {
    getAdapter().insertAllow(action, resourceName, roleName);
  };

  const forbid = ({
    action = requiredParam('action'),
    resourceName = requiredParam('resourceName'),
    roleName = requiredParam('roleName')
  }) => {
    getAdapter().insertForbid(action, resourceName, roleName);
  };

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

  const allResourceNames = () => getAdapter().findAllResourceNames();

  const allRoles = () => getAdapter().findAllRoles();

  const roleToJSON = roleName => getAdapter().findRole(roleName);

  return Object.freeze({
    registerAdapter,
    resource,
    allow,
    forbid,
    hasModel,
    getModel,
    allResourceNames,
    allRoles,
    roleToJSON
  });
};

export default createProtektor;
