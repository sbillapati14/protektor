class PermissionNotFoundError extends Error {
  constructor(actionParam, resourceParam, ...params) {
    super(...params);
    this.message = this.message || `Permission action: ${actionParam} resource: ${resourceParam} not found`;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, PermissionNotFoundError);
    }
  }
}

module.exports = PermissionNotFoundError;
