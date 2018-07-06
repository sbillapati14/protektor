class InvalidPayloadTypeError extends Error {
  constructor(...params) {
    super(...params);
    this.message = this.message || 'Invalid payload type';

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, InvalidPayloadTypeError);
    }
  }
}

module.exports = InvalidPayloadTypeError;
