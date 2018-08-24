"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tryLogin = exports.refreshTokens = exports.createTokens = undefined;

var _bcrypt = require("bcrypt");

var _bcrypt2 = _interopRequireDefault(_bcrypt);

var _jsonwebtoken = require("jsonwebtoken");

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const createTokens = exports.createTokens = async (user, secret, secret2) => {
  // {user:{id:2}}
  const createToken = _jsonwebtoken2.default.sign({
    user: _lodash2.default.pick(user, ["id", "username"])
  }, secret, {
    expiresIn: "1h"
  });

  const createRefreshToken = _jsonwebtoken2.default.sign({
    user: _lodash2.default.pick(user, ["id", "username"])
  }, secret2, {
    expiresIn: "7d"
  });

  return [createToken, createRefreshToken];
};

const refreshTokens = exports.refreshTokens = async (token, refreshToken, models, SECRET, SECRET2) => {
  let userId = 0;
  /**
   * We can't trust the token. Later down in that method, I verify the token.
   * I decoded it first to get the userId so I could get the password so I could verify the token (because the password was used in the secret for the token).
   * If you don't use the user's password to sign the token, you can just verify the token
   */
  try {
    const {
      user: { id }
    } = _jsonwebtoken2.default.decode(refreshToken);
    userId = id;
  } catch (err) {
    return {};
  }

  if (!userId) {
    return {};
  }

  const user = await models.User.findOne({ where: { id: userId }, raw: true });

  if (!user) {
    return {};
  }

  const refreshSecret = user.password + SECRET2;

  try {
    _jsonwebtoken2.default.verify(refreshToken, refreshSecret);
  } catch (err) {
    return {};
  }

  const [newToken, newRefreshToken] = await createTokens(user, SECRET, refreshSecret);
  return {
    token: newToken,
    refreshToken: newRefreshToken,
    user
  };
};

const tryLogin = exports.tryLogin = async (email, password, models, SECRET, SECRET2) => {
  const user = await models.User.findOne({ where: { email }, raw: true });
  if (!user) {
    return {
      ok: false,
      errors: [{ path: "email", message: "Wrong email" }]
    };
  }

  const valid = await _bcrypt2.default.compare(password, user.password);
  if (!valid) {
    return {
      ok: false,
      errors: [{ path: "password", message: "Wrong password" }]
    };
  }

  // token will automati
  const refreshTokenSecret = user.password + SECRET2;

  const [token, refreshToken] = await createTokens(user, SECRET, refreshTokenSecret);

  return {
    ok: true,
    token,
    refreshToken
  };
};