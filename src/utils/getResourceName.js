const { InvalidResourceTypeError } = require('../Errors');

function getResourceName(subject) {
  if (!subject) {
    throw new InvalidResourceTypeError();
  }
  if (typeof subject === 'string') {
    return subject;
  }
  const resourceType = typeof subject === 'object' ? subject.constructor : subject;
  return resourceType.name;
}

module.exports = getResourceName;
