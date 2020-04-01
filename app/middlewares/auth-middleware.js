const { Unauthorized } = require('http-errors');
const { getGoogleUser } = require('./auth-utils');
const { isInstanceOfSome } = require('../utils/toolbox');
const { detailsByGoogleId } = require('../services/users');

// https://developers.google.com/identity/sign-in/web/backend-auth

const ensureGoogleUserAvailable = async (req, res, next) => {
  const {
    sub: google_id,
    email,
    email_verified,
    name,
    picture,
    given_name,
    family_name,
    locale,
  } = await getGoogleUser(req);

  res.locals.googleUser = {
    google_id,
    email,
    email_verified,
    name,
    picture,
    given_name,
    family_name,
    locale,
  };

  next();
};

const ensureAuthenticated = async (req, res, next) => {
  const googleUser = await getGoogleUser(req);
  const googleId = googleUser['sub'];

  const user = await detailsByGoogleId(googleId);

  if (!user) {
    throw new Unauthorized('User not authenticated');
  }

  res.locals.currentUser = { ...user.toJSON() };

  next();
};

const ensureIsAdmin = async (req, res, next) => {
  if (!(res.locals.currentUser && res.locals.currentUser.is_admin)) {
    throw new Unauthorized('User not authorized');
  }

  next();
};

const bailedOutAuthentication = async (req, res, next) => {
  try {
    await ensureAuthenticated(req, res, next);
  } catch (error) {
    if (isInstanceOfSome([Unauthorized])(error)) {
      next();
    } else {
      throw error;
    }
  }
};

module.exports = {
  ensureGoogleUserAvailable,
  ensureAuthenticated,
  ensureIsAdmin,
  bailedOutAuthentication,
};
