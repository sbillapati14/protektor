class InvalidOrMissingAdapterError extends Error {
  constructor(...params) {
    super(...params);
    this.message = this.message || 'InvalidOrMissingAdapterError';

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, InvalidOrMissingAdapterError);
    }
  }
}

module.exports = InvalidOrMissingAdapterError;
