const express = require('express');
const mongoose = require('mongoose');
// const path = require('path');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const { errors } = require('celebrate');
const { celebrate, Joi } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { auth } = require('./middlewares/auth');
const usersRoute = require('./routes/users');
const cardsRoute = require('./routes/cards');
const { NotFoundError } = require('./errors/not-found-error');
const {
  login,
  createUser,
} = require('./controllers/users');
const { REGEX_URL } = require('./utils/regex-url');

const {
  PORT = 3000,
  BASE_PATH = 'http://localhost:3000',
} = process.env;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 100, // 100 запросов с одного IP
});

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(limiter);
app.use(requestLogger); // логирование запросов
app.use(helmet());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  }),
  login,
);

app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().regex(REGEX_URL),
    }),
  }),
  createUser,
);

app.use('/users', usersRoute);
app.use('/cards', auth, cardsRoute);
app.use('*', (req, res, next) => {
  const err = new NotFoundError('Неверный адрес запроса');
  return next(err);
});

app.use(errorLogger); // логирование ошибок после запросов
app.use(errors()); // обработчик ошибок celebrate

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err; // установка дефолтного значения
  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500
        ? `На сервере произошла ошибка - middleware ${message} - ${err.name}`
        : message,
    });
  next();
});

app.listen(PORT, () => {
  console.log('Ссылка на сервер');
  console.log(BASE_PATH);
});
