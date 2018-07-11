const requiredParam = (param) => {
  const invalidOrMissingParam = new Error(`Invalid or missing parameter: ${param}`);

  if (Error.captureStackTrace) {
    Error.captureStackTrace(invalidOrMissingParam, requiredParam);
  }

  throw invalidOrMissingParam;
};

module.exports = requiredParam;
