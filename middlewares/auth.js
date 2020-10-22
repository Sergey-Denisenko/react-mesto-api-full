const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;

const AuthError = require('../errors/auth-error');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  console.log('authorization in Auth.js back');
  console.log(authorization);
  if (!authorization && !authorization.startsWith('Bearer')) {
    // return res.status(401).send({ message: 'Необходима авторизация 1' });
    next(new AuthError('Unauthorized / Необходима авторизация 1')); // 401
  }

  const token = authorization.replace('Bearer', '');
  console.log('token in Auth.js back');
  console.log(token);
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
    // eslint-disable-next-line no-console
    console.log('process.env.NODE_ENV - в auth.js');
    // eslint-disable-next-line no-console
    console.log(process.env.NODE_ENV);
    console.log('payload in Auth.js back');
    console.log(payload);
  } catch (err) {
    // return res.status(401).send({ message: 'Необходима авторизация 2' });
    next(new AuthError('Unauthorized / Необходима авторизация 2')); // 401
  }

  req.user = payload; // записываю пейлоуд в объект запроса
  next(); // пускаю запрос дальше
};
