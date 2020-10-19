const express = require('express'); // подключаю express
const mongoose = require('mongoose'); // подключаю mongoose
require('dotenv').config();
const bodyParser = require('body-parser'); // подключаю body-parser
const unknownPageRouter = require('express').Router(); // создаю роутер для запроса неизвестного адреса на сервере
const {
  celebrate, Joi, errors, Segments,
} = require('celebrate'); // Ваидация входящих запросов
const helmet = require('helmet'); // Модуль автоматической простановки заголовков безопасности
const rateLimit = require('express-rate-limit'); // Модуль ограничения количества запросов
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

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // за 15 минут
  max: 100, // можно совершить максимум 100 запросов с одного IP
});

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
app.use(limiter); // подключtение rate-limiter
app.use(helmet()); // Мидлвэр автоматической простановки заголовков безопасности

// app.use(function(req, res, next) {
//   res.header('Access-Control-Allow-Origin', 'https://world.students.nomoreparties.xyz');
//   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//   res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');

//   next();
// });

// Массив разешённых доменов
const allowedCors = [
  'https://world.students.nomoreparties.xyz',
  'http://world.students.nomoreparties.xyz',
  'https://api.world.students.nomoreparties.xyz',
  'http://api.world.students.nomoreparties.xyz',
  'localhost:3000',
];

app.use(function(req, res, next) {
  const { origin } = req.headers; // Записываем в переменную origin соответствующий заголовок

  if (allowedCors.includes(origin)) { // Проверяем, что значение origin есть среди разрешённых доменов
    res.header('Access-Control-Allow-Origin', origin);
  }

  next();
});

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
