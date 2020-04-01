const { BadRequest } = require('http-errors');

const validateRequest = (validationResult, options) => {
  try {
    validationResult.throw();
  } catch (errors) {
    throw new BadRequest({ errors: errors.array(options) });
  }
};

module.exports = { validateRequest };
