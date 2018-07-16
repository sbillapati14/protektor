class ModelResourceMapNotFoundError extends Error {
  constructor(model, resource, ...params) {
    super(...params);
    this.message = this.message || `Resource ${resource} to Model ${model} mapping not found`;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ModelResourceMapNotFoundError);
    }
  }
}

module.exports = ModelResourceMapNotFoundError;
