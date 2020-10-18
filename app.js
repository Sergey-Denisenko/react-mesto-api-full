const express = require('express'); // подключаю express
const mongoose = require('mongoose'); // подключаю mongoose
require('dotenv').config();
const bodyParser = require('body-parser'); // подключаю body-parser
const unknownPageRouter = require('express').Router(); // создаю роутер для запроса неизвестного адреса на сервере
const {
  celebrate, Joi, errors, Segments,
} = require('celebrate'); // Ваидация входящих запросов
const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const NotFoundError = require('./errors/not-found-err');

const app = express(); // создаю приложение на express

mongoose.connect('mongodb://localhost:27017/mestodb', { // подключаюсь к серверу mongo
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

const { PORT = 3000 } = process.env; // слущаю порт

// const path = require('path');
const usersRouter = require('./routes/users.js');
const cardsRouter = require('./routes/cards.js');

// eslint-disable-next-line no-console
console.log('process.env.NODE_ENV - в app.js');
// eslint-disable-next-line no-console
console.log(process.env.NODE_ENV);
// Роутер для запроса неизвестного адреса на сервере
unknownPageRouter.all('*', (req, res, next) => {
  // res.status(404).send({ message: 'Запрашиваемый ресурс не найден' });
  next(new NotFoundError('Not Found / Запрашиваемый ресурс не найден')); // 404
});

// eslint-disable-next-line max-len
// app.use((req, res, next) => { // Временное решение авторизации, мидлвэр который добавляет в каждый запрос объект user
//   req.user = {
//     _id: '5f66030c4209ed3107201166', // _id тестового пользователя
//   };
//   next();
// });
app.use(requestLogger); // Подключение логера запросов
// Роутинг
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.post('/signin', celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().email({ tlds: { allow: false } }).required(),
    password: Joi.string().min(8).required(),
  }),
  // [Segments.QUERY]: {
  //   token: Joi.string().token().required(),
  // },
}), login);

app.post('/signup', celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().email({ tlds: { allow: false } }).required(),
    password: Joi.string().min(8).required(),
  }).unknown(),
}), createUser);

// app.use(auth);
app.use('/users', auth, usersRouter); // Запуск usersRouter с авторизацией
app.use('/cards', auth, cardsRouter); // Запуск cardsRouter с авторизацией
app.use(unknownPageRouter); // Запуск unknownPageRouter

// Подключение логера ошибок
app.use(errorLogger);

// обработчик ошибок celebrate
app.use(errors());

// Мидлвэр централизованной обработки ошибок
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  // eslint-disable-next-line no-console
  console.log('сработала централизованная обработка ошибок');
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({ message: statusCode === 500 ? 'На сервере произошла ошибка' : message });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`); // Вывод в консоль порта, кот. слушает приложение
});
