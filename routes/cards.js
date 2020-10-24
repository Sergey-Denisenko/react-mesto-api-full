const cardsRouter = require('express').Router(); // создание роутера для запроса всех карточек
const {
  celebrate, Joi, Segments,
} = require('celebrate'); // Ваидация входящих запросов
const {
  getAllCards, createCard, deleteCardById, addLikeCardById, deleteLikeCardById,
} = require('../controllers/cards');

// cardsRouter.get('/', celebrate({
//   [Segments.BODY]: Joi.object().keys({
//     owner: Joi.required(),
//   }).unknown(),
// }), getAllCards);

cardsRouter.post('/', celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().required(),
    // owner: Joi.required(),
  }).unknown(),
}), createCard);

// cardsRouter.put('/:cardId/likes', celebrate({
cardsRouter.put('/likes/:cardId', celebrate({
  [Segments.BODY]: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }).unknown(),
}), addLikeCardById); // поставить лайк карточке

// cardsRouter.delete('/:cardId/likes', celebrate({
cardsRouter.delete('/likes/:cardId', celebrate({
  [Segments.BODY]: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }).unknown(),
}), deleteLikeCardById); // убрать лайк с карточки

cardsRouter.delete('/:cardId', celebrate({
  [Segments.BODY]: Joi.object().keys({
    cardId: Joi.string().alphanum().length(24),
  }).unknown(),
}), deleteCardById);

module.exports = cardsRouter;

// , celebrate({
//   [Segments.BODY]: Joi.object().keys({
//     name: Joi.string().min(2).max(30).required(),
//     link: Joi.string().required(),
//     owner: Joi.required(),
//   }).unknown(),
// }),
