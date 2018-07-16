class InvalidModelTypeError extends Error {
  constructor(...params) {
    super(...params);
    this.message = this.message || 'InvalidModelTypeError';

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, InvalidModelTypeError);
    }
  }
}

module.exports = InvalidModelTypeError;
