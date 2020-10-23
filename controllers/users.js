const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// const crypto = require('crypto');
const User = require('../models/user'); // импортирую модель user
const BadRequestError = require('../errors/bad-requet-error'); // 400
const NotFoundError = require('../errors/not-found-err'); // 404
// eslint-disable-next-line no-unused-vars
const getAllUsers = (req, res, next) => { // роутер чтения документа
  User.find({}) // нахожу все пользователей
    .orFail(new Error('GetUsersError'))
    .then((users) => {
      res.send({ data: users });
    })
    // eslint-disable-next-line no-unused-vars
    .catch((err) => {
      if (err.message === 'GetUsersError') {
        // res.status(404).send({ message: 'Not Found / Пользователи не найдены' });
        next(new NotFoundError('Not Found / Пользователи не найдены 87')); // 404
      } else {
        // res.status(500).send({ message: 'На сервере произошла ошибка' });
        next(err); // 500
      }
    });
};

const getUserById = (req, res, next) => { // роутер чтения документа
  User.findById(req.params.userId) // нахожу пользователя по запросу параметра id
    .orFail(new Error('NoUserId'))
    .then((user) => res.status(200).send({ data: user }))
    // eslint-disable-next-line no-unused-vars
    .catch((err) => {
      if (err.message === 'NoUserId') {
        // res.status(404).send({ message: 'User Id Not Found / Нет пользователя с таким Id' });
        next(new NotFoundError('User Id Not Found / Нет пользователя с таким Id 44')); // 404
      } else if (err.name === 'CastError') {
        // res.status(400).send({ message: 'Bad Request / Неверный запрос' });
        next(new BadRequestError('Bad Request / Неверный запрос 56')); // 400
      } else {
        // res.status(500).send({ message: 'На сервере произошла ошибка' });
        next(err); // 500
      }
    });
};

// eslint-disable-next-line no-unused-vars
const createUser = (req, res, next) => { // роутер создания документа
// const { name, about, avatar } = req.body; //получаю из объекта запроса данные:имя,описание,avatar

  // eslint-disable-next-line no-console
  console.log('req.body');
  // eslint-disable-next-line no-console
  console.log(req.body);

  // const {
  //   name, about, avatar, email, password,
  // } = req.body; // получаю из объекта запроса данные

  bcrypt.hash(req.body.password, 10)
    .then((hash) => {
      // eslint-disable-next-line no-console
      console.log('check 1');
      return User.create({
        // name: req.body.name,
        // about: req.body.about,
        // avatar: req.body.avatar,
        email: req.body.email,
        password: hash,
      }); // создаю документ на основе пришедших данных
    })
    .then((user) => {
      //       if (!user) {
      //   console.log('user4563434');
      //   throw new BadRequestError('Bad Request / Неверный запрос 10000');
      // }
      // eslint-disable-next-line no-console
      console.log('user456');
      // eslint-disable-next-line no-console
      console.log(user);
      res.status(201).send(user);
    })
    // eslint-disable-next-line no-unused-vars
    // .catch((err) => {
    //   if (err.name === 'ValidationError') {
    //     res.status(400).send({ message: 'Bad Request / Неверный запрос 1' });
    //     // eslint-disable-next-line no-console
    //     console.log('err1');
    //   } else {
    //     res.status(500).send({ message: 'На сервере произошла ошибка 1' });
    //     // eslint-disable-next-line no-console
    //     console.log('err2');
    //   }
    .catch((err) => {
      // next(err);
      console.log('err43');
      console.log(err);
      if (err.name === 'ValidationError' || err.message === 'is not a valid email!') {
        next(new BadRequestError('Bad Request / Неверный запрос 10000')); // 400
      } else next(err); // 500
    });
// });
  // })
};

const updateProfileUser = (req, res, next) => { // роутер редактирования профиля пользователя
  const { name, about } = req.body; // получаю из объекта запроса данные:имя,описание,avatar
  // создаю обновленный документ на основе пришедших данных
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(new Error('UpdateUserError'))
    .then((user) => {
      res.send({ data: user });
    })
    // eslint-disable-next-line no-unused-vars
    .catch((err) => {
      if (err.message === 'UpdateUserError') {
        // res.status(404).send({ message: 'Not Found / Пользователь не найден' });
        next(new NotFoundError('Not Found / Пользователь не найден 31')); // 404
      } else if (err.name === 'ValidationError') {
        // res.status(400).send({ message: 'Bad Request / Неверный запрос' });
        next(new BadRequestError('Bad Request / Неверный запрос 58')); // 400
      } else {
        // res.status(500).send({ message: 'На сервере произошла ошибка' });
        console.log('ошибка 500 вываливается в updateProfileUser файла controllers->users.js');
        next(err); // 500
      }
    });
};

const updateAvatarUser = (req, res, next) => { // роутер редактирования профиля пользователя
  const { avatar } = req.body; // получаю из объекта запроса данные:имя,описание,avatar
  // создаю обновленный документ на основе пришедших данных
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(new Error('UpdateUserError'))
    .then((userAvatar) => {
      res.send({ data: userAvatar });
    })
    // eslint-disable-next-line no-unused-vars
    .catch((err) => {
      if (err.message === 'UpdateUserError') {
        // res.status(404).send({ message: 'Not Found / Пользователь не найден' });
        next(new NotFoundError('Not Found / Пользователь не найден 96')); // 404
      } else if (err.name === 'ValidationError') {
        // res.status(400).send({ message: 'Bad Request / Неверный запрос' });
        next(new BadRequestError('Bad Request / Неверный запрос 97')); // 400
      } else {
        // res.status(500).send({ message: 'На сервере произошла ошибка' });
        next(err); // 500
      }
    });
};

const { NODE_ENV, JWT_SECRET } = process.env;

const login = (req, res, next) => {
  const { email, password } = req.body;
  console.log('req.body in Login');
  console.log(req.body);

  return User.findUserByCredentials(email, password)
    .then((user) => {
      console.log('user123');
      console.log(user);

      // Для создания токена  вызываю метод jwt.sign.
      // Передаю методу sign аргументы: пейлоад и секретный ключ подписи
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      // eslint-disable-next-line no-console
      console.log('process.env.NODE_ENV - в users.js');
      // eslint-disable-next-line no-console
      console.log(process.env.NODE_ENV);
      // eslint-disable-next-line no-console
      console.log(token);
      res.send({ token });
      // res.cookie('jwt', token, { maxAge: '7d', httpOnly: true });
      // eslint-disable-next-line no-console
      console.log('3 - аутентификация пройдена,токен создан  - user');
    })
    .catch((err) => {
      next(err);
      console.log('100');
      console.log('err100');
      console.log(err);
    });

  // User.findOne({ email })
  //   .then((user) => {
  //     if (!user) {
  //       return Promise.reject(new Error('Неправильные почта или пароль'));
  //     }
  //     // пользователь найден
  //     return bcrypt.compare(password, user.password);
  //   })
  //   .then((compareOk) => {
  //     if (!compareOk) {
  //       return Promise.reject(new Error('Неправильные почта или пароль'));
  //     }

  //     res.send({ message: 'Введенные данные верны!' });
  //   })
  //   .catch((err) => {
  //     res.status(401).send({ message: err.message });
  //   });
};

const getMeById = (req, res, next) => { // роутер чтения документа
  User.findById(req.user._id) // нахожу пользователя по запросу параметра id
    .orFail(new Error('NoUserId'))
    .then((user) => res.status(200).send({ data: user }))
    // eslint-disable-next-line no-unused-vars
    .catch((err) => {
      if (err.message === 'NoUserId') {
        // res.status(404).send({ message: 'User Id Not Found / Нет пользователя с таким Id' });
        next(new NotFoundError('User Id Not Found / Нет пользователя с таким Id 4444')); // 404
      } else if (err.name === 'CastError') {
        // res.status(400).send({ message: 'Bad Request / Неверный запрос' });
        next(new BadRequestError('Bad Request / Неверный запрос 5656')); // 400
      } else {
        // res.status(500).send({ message: 'На сервере произошла ошибка' });
        next(err); // 500
      }
    });
};

module.exports = {
  getAllUsers, getUserById, createUser, updateProfileUser, updateAvatarUser, login, getMeById,
};
