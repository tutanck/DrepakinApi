const { Unauthorized } = require('http-errors');
const { OAuth2Client } = require('google-auth-library');

// https://developers.google.com/identity/sign-in/web/backend-auth

const getGoogleUser = async req => {
  const bearerToken = req.headers['authorization'] || '';
  const token = bearerToken.replace('Bearer_', '');

  const client = new OAuth2Client(process.env.OAUTH_CLIENT_ID);

  let ticket;
  try {
    ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.REACT_APP_OAUTH_CLIENT_ID,
    });
  } catch (e) {
    throw new Unauthorized('Invalid authentication token');
  }

  const payload = ticket.getPayload();
  return payload;
};

module.exports = {
  getGoogleUser,
};
