const jwt = require('jsonwebtoken');

// const { NODE_ENV, JWT_SECRET } = process.env;

const AuthError = require('../errors/auth-error');

// eslint-disable-next-line consistent-return
module.exports.auth = (req, res, next) => {
  console.log('req in Auth.js back');
  console.log(req);
  console.log('req.headers in Auth.js back');
  console.log(req.headers);

  const { authorization } = req.headers;
  console.log('authorization in Auth.js back');
  console.log(authorization);
  // if (!authorization && !authorization.startsWith('Bearer ')) {
  //   // return res.status(401).send({ message: 'Необходима авторизация 1' });
  //   console.log('res error in Auth.js back');
  //   console.log(res);
  //   next(new AuthError('Unauthorized / Необходима авторизация 1')); // 401
  // }

  // const token = authorization.replace('Bearer ', '');

  // const token = req.headers.authorization && req.headers.authorization.replace('Bearer ', '');
  const token = authorization && authorization.replace('Bearer ', '');

  console.log('token in Auth.js back');
  console.log(token);
  let payload;

  try {
    // eslint-disable-next-line max-len
    // payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
    payload = jwt.verify(token, 'dev-key');
    // eslint-disable-next-line no-console
    console.log('process.env.NODE_ENV - в auth.js');
    // eslint-disable-next-line no-console
    console.log(process.env.NODE_ENV);
    console.log('payload in Auth.js back');
    console.log(payload);
  } catch (err) {
    console.log('err in Auth.js back');
    console.log(err);
    // return res.status(401).send({ message: 'Необходима авторизация 2' });
    next(new AuthError('Unauthorized / Необходима авторизация 2')); // 401
  }

  req.user = payload; // записываю пейлоуд в объект запроса
  next(); // пускаю запрос дальше
};
