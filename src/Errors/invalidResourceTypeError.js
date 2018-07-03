class InvalidResourceTypeError extends Error {
  constructor(...params) {
    super(...params);
    this.message = this.message || 'InvalidResourceTypeError';

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, InvalidResourceTypeError);
    }
  }
}

module.exports = InvalidResourceTypeError;
