class RoleNotFoundError extends Error {
  constructor(param1, ...params) {
    super(...params);
    this.message = this.message || `Role ${param1} not found`;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, RoleNotFoundError);
    }
  }
}

module.exports = RoleNotFoundError;
