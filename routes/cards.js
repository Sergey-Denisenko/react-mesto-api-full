const cardsRouter = require('express').Router(); // создание роутера для запроса всех карточек
const {
  // eslint-disable-next-line no-unused-vars
  celebrate, Joi, Segments,
} = require('celebrate'); // Ваидация входящих запросов
const {
  // eslint-disable-next-line no-unused-vars
  getAllCards, createCard, deleteCardById, addLikeCardById, deleteLikeCardById,
} = require('../controllers/cards');

cardsRouter.post('/', celebrate({
  // [Segments.BODY]: Joi.object().keys({
  params: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    // link: Joi.string().required(),
    // eslint-disable-next-line no-useless-escape
    link: Joi.string().pattern(/^(https?:\/\/)([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?#?$/).required(),
    // owner: Joi.required(),
  }).unknown(),
}), createCard);

// cardsRouter.put('/:cardId/likes', celebrate({
cardsRouter.put('/likes/:cardId', celebrate({
  // [Segments.BODY]: Joi.object().keys({
  params: Joi.object().keys({
    // cardId: Joi.string().alphanum().length(24),
    cardId: Joi.string().hex().length(24),
  }).unknown(),
}), addLikeCardById); // поставить лайк карточке

// cardsRouter.delete('/:cardId/likes', celebrate({
cardsRouter.delete('/likes/:cardId', celebrate({
  // [Segments.BODY]: Joi.object().keys({
  params: Joi.object().keys({
    // cardId: Joi.string().alphanum().length(24),
    cardId: Joi.string().hex().length(24),
  }).unknown(),
}), deleteLikeCardById); // убрать лайк с карточки

cardsRouter.delete('/:cardId', celebrate({
  // [Segments.BODY]: Joi.object().keys({
  params: Joi.object().keys({
    // cardId: Joi.string().alphanum().length(24),
    cardId: Joi.string().hex().length(24),
  }).unknown(),
}), deleteCardById);

module.exports = cardsRouter;
