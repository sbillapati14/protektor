const { InvalidModelTypeError } = require('../Errors');

function getModelName(subject) {
  if (!subject) {
    throw new InvalidModelTypeError();
  }
  if (typeof subject === 'string') {
    return subject;
  }
  const modelType = typeof subject === 'object' ? subject.constructor : subject;
  return modelType.name;
}

module.exports = getModelName;
