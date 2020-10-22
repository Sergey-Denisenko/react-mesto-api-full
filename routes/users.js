const usersRouter = require('express').Router(); // создание роутера для работы с пользователями
const {
  celebrate, Joi,
  Segments,
} = require('celebrate'); // Ваидация входящих запросов

const {
  getAllUsers, getUserById, updateProfileUser, updateAvatarUser,
  // createUser,
} = require('../controllers/users');

usersRouter.get('/', getAllUsers);

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

module.exports = usersRouter;
