const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../utils/constants');
const UnauthorizedError = require('../errors/unauthorizedError');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, SECRET_KEY);
  } catch (error) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }
  req.user = payload;
  return next();
};
