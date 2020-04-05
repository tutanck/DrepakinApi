const {
  BadRequest,
  Unauthorized,
  PaymentRequired,
  Forbidden,
  NotFound,
  ServiceUnavailable,
} = require('http-errors');
const { MongoError } = require('mongodb');
const DocumentNotFoundError = require('mongoose/lib/error/notFound'); // TODO better ? --uniformize with 'http-errors to have the same error pattern in the client side maybe replace all by NotFound from http errors to uniformize

const { isInstanceOfSome } = require('../utils/toolbox');

// the order matters
module.exports = {
  // log all errors
  logDevErrors(error, req, res, next) {
    if (process.env.NODE_ENV === 'dev') {
      console.error('--logDevErrors--', error);
    }
    next(error);
  },

  // 400	BadRequest
  handleBadRequestError(error, req, res, next) {
    if (isInstanceOfSome([BadRequest])(error)) {
      return res.status(400).json({
        error,
      });
    } else {
      next(error);
    }
  },

  // 401 Unauthorized
  handleUnauthorizedError(error, req, res, next) {
    if (isInstanceOfSome([Unauthorized])(error)) {
      return res.status(401).json({
        error,
      });
    } else {
      next(error);
    }
  },

  // 402 PaymentRequired
  handlePaymentRequiredError(error, req, res, next) {
    if (isInstanceOfSome([PaymentRequired])(error)) {
      return res.status(402).json({
        error,
      });
    } else {
      next(error);
    }
  },

  // 403 Forbidden
  handleForbiddenError(error, req, res, next) {
    if (isInstanceOfSome([Forbidden])(error)) {
      return res.status(403).json({
        error,
      });
    } else {
      next(error);
    }
  },

  // 404 NotFound
  handleNotFoundError(error, req, res, next) {
    if (isInstanceOfSome([NotFound, DocumentNotFoundError])(error)) {
      return res.status(404).json({
        error,
      });
    } else {
      next(error);
    }
  },

  // log errors that matters (server errors)
  logServerErrors(error, req, res, next) {
    if (process.env.NODE_ENV === 'production') {
      console.error('--logServerErrors--', error);
    }

    next(error);
  },

  // 503 ServiceUnavailable
  handleServiceUnavailableError(error, req, res, next) {
    if (isInstanceOfSome([ServiceUnavailable, MongoError])(error)) {
      return res.status(503).json({
        error,
      });
    } else {
      next(error);
    }
  },

  // 500 InternalServerError
  /** /!\ SHOULD ALLWAYS BE THE LAST !!! **/
  // eslint-disable-next-line no-unused-vars
  handleInternalServerError(error, req, res, next /* Do not remove 'next' */) {
    return res.status(500).json({
      error,
    });
  },
};
