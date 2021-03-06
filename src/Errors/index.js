const InvalidResourceTypeError = require('./InvalidResourceTypeError');
const RoleNotFoundError = require('./RoleNotFoundError');
const PermissionNotFoundError = require('./PermissionNotFoundError');
const InvalidPayloadTypeError = require('./InvalidPayloadTypeError');
const InvalidModelTypeError = require('./InvalidModelTypeError');
const ModelResourceMapNotFoundError = require('./ModelResourceMapNotFoundError');
const RoleDisabledError = require('./RoleDisabledError');
const InvalidOrMissingAdapterError = require('./InvalidOrMissingAdapterError');

module.exports = {
  InvalidResourceTypeError,
  RoleNotFoundError,
  PermissionNotFoundError,
  InvalidPayloadTypeError,
  InvalidModelTypeError,
  ModelResourceMapNotFoundError,
  RoleDisabledError,
  InvalidOrMissingAdapterError
};
