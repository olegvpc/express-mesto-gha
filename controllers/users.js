const User = require('../models/user');

const {
  NOT_FOUND_CODE,
  VALIDATION_ERROR_CODE,
  DEFAULT_ERROR_CODE,
} = require('../errors/error-codes');

module.exports.getAllUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(500).send({ message: 'На сервере произошла ошибка' }));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  // console.log(name, about, avatar);
  User.create({ name, about, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(VALIDATION_ERROR_CODE).send({ message: `Переданы некорректные данные при создании пользователя.${err.name}` });
        return;
      }
      res.status(DEFAULT_ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.getCurrentUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new Error('Пользователь не найден');
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(VALIDATION_ERROR_CODE).send({ message: `Передан некорректный _id: ${req.params.userId} пользователя.${err.name}` });
        return;
      }
      if (err.name === 'Error') {
        res.status(NOT_FOUND_CODE).send({ message: `Пользователь с _id: ${req.params.userId} не найден.${err.name} ` });
        return;
      }
      res.status(DEFAULT_ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id, // 632dd2b94ceb7519db223be0
    { name, about },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
      upsert: false, // если пользователь не найден, он будет создан
    },
  )
    .then((user) => {
      if (!user) {
        throw new Error('Пользователь не найден');
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(VALIDATION_ERROR_CODE).send({ message: `Передан некорректный _id: ${req.params.userId} пользователя.${err.name}` });
        return;
      }
      if (err.name === 'Error') {
        res.status(NOT_FOUND_CODE).send({ message: `Пользователь с _id: ${req.params.userId} не найден.${err.name} ` });
        return;
      }
      if (err.name === 'ValidationError') {
        res.status(VALIDATION_ERROR_CODE).send({ message: 'Переданы некорректные данные при обновении профиля.' });
        return;
      }
      res.status(DEFAULT_ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id, // 632dd2b94ceb7519db223be0
    { avatar },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
      upsert: false, // если пользователь не найден, он будет создан
    },
  )
    .then((user) => {
      if (!user) {
        throw new Error('Пользователь не найден');
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(VALIDATION_ERROR_CODE).send({ message: `Передан некорректный _id: ${req.params.userId} пользователя.${err.name} ` });
        return;
      }
      if (err.name === 'Error') {
        res.status(NOT_FOUND_CODE).send({ message: `Пользователь с _id: ${req.params.userId} не найден.${err.name} ` });
        return;
      }
      if (err.name === 'ValidationError') {
        res.status(VALIDATION_ERROR_CODE).send({ message: 'Переданы некорректные данные при обновении аватара.' });
        return;
      }
      res.status(DEFAULT_ERROR_CODE).send({ message: 'На сервере произошла ошибка' });
    });
};
