/**
 * http://www.jsonrpc.org/specification#error_object
 */

'use strict';

const extend = require('util')._extend;

const codes = {
  INVALID_REQUEST: -32600,
  UNAUTHORIZED: -32099,
  AUTH_TOKEN_EXPIRED: -32098,
  AUTH_TOKEN_INVALID: -32097,
  READONLY_SESSION: -32096,
  SIGNUP_FOLLOWERS_NUMBER: -32095,
  AUTH_UNACTIVE_USER: -32094,
  INVALID_PARAMS: -32001,
  NOT_IMPLEMENTED: -32000,
};

function generate(message, error, code, data) {
  return {
    // Ext.Direct expects the error (object or string) to be store in data.message
    message: extend(extend({}, data), {
      message: message || 'Invalid Request',
      name: error || 'InvalidRequest',
      code: code == null ? codes.INVALID_REQUEST : code,
    }),
  };
}

const types = {
  unauthorized(data) {
    return generate(
      'User is not authorized to perform this action',
      'Unauthorized',
      codes.UNAUTHORIZED,
      data
    );
  },

  authTokenExpired(data) {
    return generate(
      'Your session has expired, please login again',
      'AuthTokenExpired',
      codes.AUTH_TOKEN_EXPIRED,
      data
    );
  },

  authTokenInvalid(data) {
    return generate(
      'Your session is no longer valid, please login again',
      'AuthTokenInvalid',
      codes.AUTH_TOKEN_INVALID,
      data
    );
  },

  authUnactiveUser(data) {
    return generate(
      'User is inactive',
      'AuthUnactiveUser',
      codes.AUTH_UNACTIVE_USER,
      data
    );
  },

  notImplemented(data) {
    return generate(
      'Not implemented',
      'NotImplemented',
      codes.NOT_IMPLEMENTED,
      data
    );
  },

  invalidParams(data) {
    if (!Array.isArray(data)) {
      data = [data];
    }

    return generate(
      'Invalid parameters',
      'InvalidParameters',
      codes.INVALID_PARAMS,
      { errors: data }
    );
  },
};

module.exports = {
  codes,

  types,

  generate,

  parse(error) {
    switch (error.name) {
      case 'SequelizeValidationError':
      case 'SequelizeUniqueConstraintError':
        return types.invalidParams(error.errors.map(error => ({ message: error.message, path: error.path })));
      default:
        return error;
    }
  },

  fromJwtError(data) {
    // https://github.com/auth0/node-jsonwebtoken#errors--codes
    if (data.name === 'TokenExpiredError') {
      return types.authTokenExpired(data);
    } else if (data.name === 'JsonWebTokenError') {
      return types.authTokenInvalid(data);
    }
    return types.unauthorized(data);
  },
};
