const usersRouter = require('express').Router(); // создание роутера для работы с пользователями
const meRouter = require('express').Router();
const {
  celebrate, Joi,
  // eslint-disable-next-line no-unused-vars
  Segments,
} = require('celebrate'); // Ваидация входящих запросов

const {
  getUserById, updateProfileUser, updateAvatarUser, getMeById,

} = require('../controllers/users');

meRouter.get('/', celebrate({
  // [Segments.BODY]: Joi.object().keys({
  params: Joi.object().keys({
    // userId: Joi.string().alphanum().length(24),
    userId: Joi.string().hex().length(24),
  }).unknown(),
}), getMeById);

usersRouter.get('/:userId', celebrate({
  // [Segments.BODY]: Joi.object().keys({
  params: Joi.object().keys({
    // userId: Joi.string().alphanum().length(24),
    userId: Joi.string().hex().length(24),
  }),
}), getUserById);

usersRouter.patch('/me', celebrate({
  // [Segments.BODY]: Joi.object().keys({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }).unknown(),
}), updateProfileUser); // обновляю профиль

usersRouter.patch('/me/avatar', celebrate({
  // [Segments.BODY]: Joi.object().keys({
  body: Joi.object().keys({
  // eslint-disable-next-line no-useless-escape
    avatar: Joi.string().pattern(/^(https?:\/\/)([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?#?$/).required(),
  }).unknown(),
}), updateAvatarUser); // обновляю аватар

module.exports = { usersRouter, meRouter };
