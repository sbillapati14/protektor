const requiredParam = (param) => {
  const invalidOrMissingParam = new Error(`Invalid or missing parameter: ${param}`);

  if (typeof Error.captureStackTrace === 'function') {
    Error.captureStackTrace(invalidOrMissingParam, requiredParam);
  }

  throw invalidOrMissingParam;
};

module.exports = requiredParam;
