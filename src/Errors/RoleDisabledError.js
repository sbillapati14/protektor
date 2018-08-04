class RoleDisabledError extends Error {
  constructor(...params) {
    super(...params);
    this.message = this.message || 'RoleDisabledError';

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, RoleDisabledError);
    }
  }
}

module.exports = RoleDisabledError;
