const Card = require('../models/card');
const BadRequestError = require('../errors/bad-requet-error'); // 400
const NotFoundError = require('../errors/not-found-err'); // 404

const getAllCards = (req, res, next) => {
  Card.find({})
    .populate('owner')
    .orFail(new Error('CanNotLoadCards'))
    .then((cards) => {
      console.log(('cards в controller Cards.js -> getAllCards -> catch')); // 500)
      console.log((cards)); // 500)
      // res.send({ data: cards });
      res.send({ cards });
    })
    // eslint-disable-next-line no-unused-vars
    .catch((err) => {
      if (err.message === 'CanNotLoadCards') {
        // return res.status(404).send({ message: 'Not Found / Карточки не найдены' });
        next(new NotFoundError('Not Found / Карточки не найдены getAllCards')); // 404
      }
      // return res.status(500).send({ message: 'На сервере произошла ошибка' });
      console.log(('Ошибка 500 в controller Cards.js -> getAllCards -> catch')); // 500)
      next(err);
    });
};

const createCard = (req, res, next) => {
  console.log('req in Cards.js->createCard');
  console.log(req);
  const {
    name, link, ownerId = req.user._id, likes,
  } = req.body;
  Card.create({
    name, link, owner: ownerId, likes,
  })
    .then((cardItem) => {
      res.send({ data: cardItem });
    })
    // eslint-disable-next-line no-unused-vars
    .catch((err) => {
      if (err.name === 'ValidationError') {
        // res.status(400).send({ message: 'Bad Request / Неверный запрос' });
        next(new BadRequestError('Bad Request / Неверный запрос createcard')); // 400
      } else {
        // res.status(500).send({ message: 'На сервере произошла ошибка' });
        next(err);
      }
    });
};

const deleteCardById = (req, res, next) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(new Error('NothingToDelete'))
    .then((cardItem) => {
      res.send({ data: cardItem });
    })
    .catch((err) => {
      if (err.message === 'NothingToDelete') {
        // res.status(404).send({ message: 'Not Found / Запрашиваемый ресурс не найден' });
        next(new NotFoundError('Not Found / Запрашиваемый ресурс не найден deleteCardById')); // 404
      } else {
        // res.status(500).send({ message: 'На сервере произошла ошибка' });
        next(err);
      }
    });
};

const addLikeCardById = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .orFail(new Error('NoAddLike'))
    .then((addlike) => {
      res.send({ data: addlike });
    })
    .catch((err) => {
      if (err.message === 'NoAddLike') {
        // res.status(404).send({ message: 'Not Found / Запрашиваемый ресурс не найден' });
        next(new NotFoundError('Not Found / Запрашиваемый ресурс не найден addLikeCardById')); // 404
      } else if
      (err.name === 'CastError') {
        // res.status(400).send({ message: 'Bad Request / Неверный запрос' });
        next(new BadRequestError('Bad Request / Неверный запрос addLikeCardById')); // 400
      } else {
        // res.status(500).send({ message: 'На сервере произошла ошибка' });
        next(err);
      }
    });
};

const deleteLikeCardById = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .orFail(new Error('NoDeleteLike'))
    .then((deletelike) => {
      res.send({ data: deletelike });
    })
    .catch((err) => {
      if (err.message === 'NoDeleteLike') {
        // res.status(404).send({ message: 'Not Found / Запрашиваемый ресурс не найден' });
        next(new NotFoundError('Not Found / Запрашиваемый ресурс не найден deleteLikeCardById')); // 404
      } else if
      (err.name === 'CastError') {
        // res.status(400).send({ message: 'Bad Request / Неверный запрос' });
        next(new BadRequestError('Bad Request / Неверный запрос deleteLikeCardById')); // 400
      } else {
        // res.status(500).send({ message: 'На сервере произошла ошибка' });
        next(err);
      }
    });
};

module.exports = {
  getAllCards, createCard, deleteCardById, addLikeCardById, deleteLikeCardById,
};
