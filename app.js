const express = require('express'); // подключаю express

const app = express(); // создаю приложение на express
const mongoose = require('mongoose'); // подключаю mongoose
require('dotenv').config();
const bodyParser = require('body-parser'); // подключаю body-parser
const unknownPageRouter = require('express').Router(); // создаю роутер для запроса неизвестного адреса на сервере
const {
  celebrate, Joi, errors,
  Segments,
} = require('celebrate'); // Ваидация входящих запросов
const helmet = require('helmet'); // Модуль автоматической простановки заголовков безопасности
const rateLimit = require('express-rate-limit'); // Модуль ограничения количества запросов
const { createUser, login } = require('./controllers/users');
const { auth } = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const NotFoundError = require('./errors/not-found-err');

const { PORT = 3000 } = process.env; // слущаю порт

mongoose.connect('mongodb://localhost:27017/mestodb', { // подключаюсь к серверу mongo
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
})
  .then(() => {
    // eslint-disable-next-line no-console
    console.log('База данных подключена');
  })
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.log(`Ошибка подключения базы данных: ${err}`);
  });

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // за 15 минут
  max: 1000, // можно совершить максимум 1000 запросов с одного IP
});

app.use(require('cors')());

app.use(helmet()); // Мидлвэр автоматической простановки заголовков безопасности

const { usersRouter, meRouter } = require('./routes/users.js');
const cardsRouter = require('./routes/cards.js');

// Роутер для запроса неизвестного адреса на сервере
unknownPageRouter.all('*', (req, res, next) => {
  next(new NotFoundError('Not Found / Запрашиваемый ресурс не найден')); // 404
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(requestLogger); // Подключение логера запросов
app.use(limiter); // подключtение rate-limiter

// Роутинг

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signin',
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      email: Joi.string().email({ tlds: { allow: false } }).required(),
      password: Joi.string().min(8).required(),
    }),
  }),
  login);

app.post('/signup',
  celebrate({
    [Segments.BODY]: Joi.object().keys({
      email: Joi.string().email({ tlds: { allow: false } }).required(),
      password: Joi.string().min(8).required(),
    }),
  }),
  createUser);

app.use(auth);
app.use('/users/me', meRouter); // Запуск usersRouter с авторизацией
app.use('/users', usersRouter); // Запуск usersRouter с авторизацией
app.use('/cards', cardsRouter); // Запуск cardsRouter с авторизацией

const { getAllCards } = require('./controllers/cards');

app.get('/', getAllCards);

app.use(unknownPageRouter); // Запуск unknownPageRouter

// Подключение логера ошибок
app.use(errorLogger);

// обработчик ошибок celebrate
app.use(errors());

// Мидлвэр централизованной обработки ошибок
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  // eslint-disable-next-line no-console
  console.log('сработала централизованная обработка ошибок 555');
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({ message: statusCode === 500 ? 'На сервере произошла ошибка ЙЦ' : message });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`); // Вывод в консоль порта, кот. слушает приложение
});
