const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// const crypto = require('crypto');
const User = require('../models/user'); // импортирую модель user
const BadRequestError = require('../errors/bad-requet-error'); // 400
const NotFoundError = require('../errors/not-found-err'); // 404
const ConflictError = require('../errors/conflict-error'); // 409
// eslint-disable-next-line no-unused-vars
const getAllUsers = (req, res, next) => { // роутер чтения документа
  User.find({}) // нахожу все пользователей
    .orFail(new Error(NotFoundError('Not Found / Пользователи не найдены'))) // 404
    .then((users) => {
      res.send({ data: users });
    })
    // eslint-disable-next-line no-unused-vars
    // .catch((err) => {
    //   if (err.message === 'GetUsersError') {
    //     next(new NotFoundError('Not Found / Пользователи не найдены')); // 404
    //   } else {
    //     next(err); // 500
    //   }
    // });
    .catch(next);
};

const getUserById = (req, res, next) => { // роутер чтения документа
  User.findById(req.params.userId) // нахожу пользователя по запросу параметра id
    .orFail(new Error(NotFoundError('User Id Not Found / Нет пользователя с таким Id'))) // 404
    .then((user) => res.status(200).send({ data: user }))
    // eslint-disable-next-line no-unused-vars
    // .catch((err) => {
    //   if (err.message === 'NoUserId') {
    //     next(new NotFoundError('User Id Not Found / Нет пользователя с таким Id')); // 404
    //   } else if (err.name === 'CastError') {
    //     next(new BadRequestError('Bad Request / Неверный запрос')); // 400
    //   } else {
    //     next(err); // 500
    //   }
    // });
    .catch(next);
};

// eslint-disable-next-line no-unused-vars
const createUser = (req, res, next) => { // роутер создания документа
  bcrypt.hash(req.body.password, 10)
    .then((hash) => {
      // eslint-disable-next-line no-console
      console.log('check 1');
      return User.create({
        email: req.body.email,
        password: hash,
      }); // создаю документ на основе пришедших данных
    })
    .then((user) => {
      // res.status(201).send(user);
      res.status(201).send({
        _id: user._id,
        email: user.email,
      });
    })
    .catch((err) => {
      if (err.name === 'MongoError' && err.code === 11000) {
        next(new ConflictError('Conflict / Пользователь с таким email уже существует')); // 400
      } else
      if (err.name === 'ValidationError' || err.message === 'is not a valid email!') {
        next(new BadRequestError('Bad Request / Неверный запрос')); // 400
      } else next(err); // 500
    });
};

const updateProfileUser = (req, res, next) => { // роутер редактирования профиля пользователя
  const { name, about } = req.body; // получаю из объекта запроса данные:имя,описание,avatar
  // создаю обновленный документ на основе пришедших данных
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(new Error(NotFoundError('Not Found / Пользователь не найден'))) // 404
    .then((user) => {
      res.send({ data: user });
    })
    // eslint-disable-next-line no-unused-vars
    // .catch((err) => {
    //   if (err.message === 'UpdateUserError') {
    //     next(new NotFoundError('Not Found / Пользователь не найден')); // 404
    //   } else if (err.name === 'ValidationError') {
    //     next(new BadRequestError('Bad Request / Неверный запрос')); // 400
    //   } else {
    //     next(err); // 500
    //   }
    // });
    .catch(next);
};

const updateAvatarUser = (req, res, next) => { // роутер редактирования профиля пользователя
  const { avatar } = req.body; // получаю из объекта запроса данные:имя,описание,avatar
  // создаю обновленный документ на основе пришедших данных
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(new Error(NotFoundError('Not Found / Пользователь не найден'))) // 404
    .then((userAvatar) => {
      res.send({ data: userAvatar });
    })
    // eslint-disable-next-line no-unused-vars
    // .catch((err) => {
    //   if (err.message === 'UpdateUserError') {
    //     next(new NotFoundError('Not Found / Пользователь не найден')); // 404
    //   } else if (err.name === 'ValidationError') {
    //     next(new BadRequestError('Bad Request / Неверный запрос')); // 400
    //   } else {
    //     next(err); // 500
    //   }
    // });
    .catch(next);
};

const { NODE_ENV, JWT_SECRET } = process.env;

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      // Для создания токена  вызываю метод jwt.sign.
      // Передаю методу sign аргументы: пейлоад и секретный ключ подписи
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch((err) => {
      next(err);
    });
};

const getMeById = (req, res, next) => { // роутер чтения документа
  User.findById(req.user._id) // нахожу пользователя по запросу параметра id
    .orFail(new Error(NotFoundError('User Id Not Found / Нет пользователя с таким Id'))) // 404
    .then((user) => res.status(200).send({ data: user }))
    // eslint-disable-next-line no-unused-vars
    // .catch((err) => {
    //   if (err.message === 'NoUserId') {
    //     next(new NotFoundError('User Id Not Found / Нет пользователя с таким Id')); // 404
    //   } else if (err.name === 'CastError') {
    //     next(new BadRequestError('Bad Request / Неверный запрос')); // 400
    //   } else {
    //     next(err); // 500
    //   }
    // });
    .catch(next);
};

module.exports = {
  getAllUsers, getUserById, createUser, updateProfileUser, updateAvatarUser, login, getMeById,
};
