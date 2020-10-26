const usersRouter = require('express').Router(); // создание роутера для работы с пользователями
const meRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate'); // Ваидация входящих запросов

const {
  getAllUsers, getUserById, updateProfileUser, updateAvatarUser, getMeById,
} = require('../controllers/users');

meRouter.get('/', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24),
  }).unknown(),
}), getMeById);

usersRouter.get('/', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24),
  }),
}), getAllUsers);

usersRouter.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24),
  }),
}), getUserById);

usersRouter.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }).unknown(),
}), updateProfileUser); // обновляю профиль

usersRouter.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
  // eslint-disable-next-line no-useless-escape
    avatar: Joi.string().pattern(/^(https?:\/\/)([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?#?$/).required(),
  }).unknown(),
}), updateAvatarUser); // обновляю аватар

module.exports = { usersRouter, meRouter };
