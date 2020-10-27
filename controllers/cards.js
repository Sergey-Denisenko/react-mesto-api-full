const Card = require('../models/card');
const BadRequestError = require('../errors/bad-requet-error'); // 400
const NotFoundError = require('../errors/not-found-err'); // 404

const getAllCards = (req, res, next) => {
  Card.find({})
    .populate('owner')
    .orFail(new NotFoundError('Not Found / Карточки не найдены')) // 404
    .then((cards) => {
      res.send(cards);
    })
    .catch(next);
};

const createCard = (req, res, next) => {
  const {
    name, link, ownerId = req.user._id, likes,
  } = req.body;
  Card.create({
    name, link, owner: ownerId, likes,
  })
    .then((cardItem) => {
      res.send(cardItem);
    })
    // eslint-disable-next-line no-unused-vars
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Bad Request / Неверный запрос')); // 400
      } else {
        next(err);
      }
    });
};

const deleteCardById = (req, res, next) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(new NotFoundError('Not Found / Запрашиваемый ресурс не найден')) // 404
    .then((cardItem) => {
      res.send(cardItem);
    })
    .catch(next);
};

const addLikeCardById = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .orFail(new NotFoundError('Not Found / Запрашиваемый ресурс не найден')) // 404
    .then((addlike) => {
      res.send(addlike);
    })
    .catch(next);
};

const deleteLikeCardById = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .orFail(new NotFoundError('Not Found / Запрашиваемый ресурс не найден')) // 404
    .then((deletelike) => {
      res.send(deletelike);
    })
    .catch(next);
};

module.exports = {
  getAllCards, createCard, deleteCardById, addLikeCardById, deleteLikeCardById,
};
