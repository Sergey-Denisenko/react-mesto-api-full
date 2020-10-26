const cardsRouter = require('express').Router(); // создание роутера для запроса всех карточек
const { celebrate, Joi } = require('celebrate'); // Ваидация входящих запросов
const {
  getAllCards, createCard, deleteCardById, addLikeCardById, deleteLikeCardById,
} = require('../controllers/cards');

cardsRouter.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    // eslint-disable-next-line no-useless-escape
    link: Joi.string().pattern(/^(https?:\/\/)([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?#?$/).required(),
    // owner: Joi.required(),
  }).unknown(),
}), createCard);

cardsRouter.get('/', getAllCards);

cardsRouter.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24),
  }).unknown(),
}), addLikeCardById); // поставить лайк карточке

cardsRouter.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24),
  }).unknown(),
}), deleteLikeCardById); // убрать лайк с карточки

cardsRouter.delete('/:cardId', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24),
  }).unknown(),
}), deleteCardById);

module.exports = cardsRouter;
