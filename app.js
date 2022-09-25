const express = require('express');
const mongoose = require('mongoose');
// const path = require('path');
const bodyParser = require('body-parser');
const usersRoute = require('./routes/users');
const cardsRoute = require('./routes/cards');

const {
  PORT = 3000,
  // BASE_PATH = 'http://localhost:3000',
} = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// _id созданного пользователя для автоматического добавления req.user._id во всех middleware ниже
app.use((req, res, next) => {
  req.user = {
    _id: '632dd2b94ceb7519db223be0',
  };
  next();
});
app.use('/users', usersRoute); // создание/ чтение пользователя/ пользователей
app.use('/cards', cardsRoute); // создание/ чтение карточек

app.listen(PORT, () => {
  // console.log('Ссылка на сервер');
  // console.log(BASE_PATH);
});
