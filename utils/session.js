'use strict';

const errors = require('./errors');
const config = require('./config');
const models = require('../models');
const jwt = require('jsonwebtoken');
const url = require('url');

module.exports = {
  readonly: config.session.readonly,
  initiate: async (email, password) => {
    const user = await (models.user.findOne({
      where: {
        email: email
      },
    }));

    if (!user || (user && !user.isValidPassword(password))) {
      throw errors.types.invalidParams('Invalid email and/or password');
    }

    if (user.get('status') === 0) {
      throw errors.types.authUnactiveUser();
    }

    const duration = config.session.duration;
    const expires = new Date(Date.now() + duration * 1000);
    const token = jwt.sign(
      { user_id: user.get('id') },
      config.session.secret,
      { expiresIn: duration });

    return {
      user,
      token,
      expires,
    };
  },

  verify: async (request, response, next) => {
    const header = request.headers && request.headers.authorization;
    const matches = header ? /^Bearer (\S+)$/.exec(header) : null;
    const token = matches && matches[1];
    let user;
    let decoded;

    if (token) {
      try {
        decoded = await (jwt.verify(token, config.session.secret));
      } catch (err) {
        return next(errors.types.authTokenInvalid());
      }

      user = await (models.user.findOne({
        attributes: {
          exclude: [
            'password_hash',
            'password_salt',
          ],
        },
        where: {
          id: decoded.user_id,
        },
      }));
    } else {
      user = await (models.user.findOne({
        attributes: {
          exclude: [
            'password_hash',
            'password_salt',
          ],
        },
        where: {
          email: 'guest@example.com'
        },
      }));
    }

    if (!user) {
      return next(errors.types.authTokenInvalid());
    }

    response.locals.currentUser = user;

    const resource = request.url.split('/')[1];
    const method = request.method.toLowerCase();
    const allowed = await models.acl.isAllowed(user.id, resource, method);
    
    if (!allowed) {
      return next(errors.types.unauthorized());
    }
    return next();
  },
};
