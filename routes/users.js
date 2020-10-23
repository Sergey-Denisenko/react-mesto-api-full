const usersRouter = require('express').Router(); // создание роутера для работы с пользователями
const meRouter = require('express').Router();
const {
  celebrate, Joi,
  Segments,
} = require('celebrate'); // Ваидация входящих запросов

const {
  // getAllUsers,
  getUserById, updateProfileUser, updateAvatarUser, getMeById,
  // createUser,
} = require('../controllers/users');

// usersRouter.get('/', getAllUsers);

meRouter.get('/', celebrate({
  [Segments.BODY]: Joi.object().keys({
    userId: Joi.string().alphanum().length(24),
  }).unknown(),
}), getMeById);

usersRouter.get('/:userId', celebrate({
  [Segments.BODY]: Joi.object().keys({
    userId: Joi.string().alphanum().length(24),
  }),
}), getUserById);
// usersRouter.post('/', createUser);

usersRouter.patch('/me', celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }).unknown(),
}), updateProfileUser); // обновляю профиль

usersRouter.patch('/me/avatar', celebrate({
  [Segments.BODY]: Joi.object().keys({
  // eslint-disable-next-line no-useless-escape
    avatar: Joi.string().pattern(/^(https?:\/\/)([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?#?$/).required(),
  }).unknown(),
}), updateAvatarUser); // обновляю аватар

// --------------
// usersRouter.get('/', celebrate({
//   [Segments.BODY]: Joi.object().keys({
//     name: Joi.string().min(2).max(30).required(),
//     about: Joi.string().min(2).max(30).required(),
//   }).unknown(),
// }), updateProfileUser); // обновляю профиль
//---------------

module.exports = { usersRouter, meRouter };
