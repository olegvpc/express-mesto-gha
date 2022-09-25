const Card = require('../models/card');

const NOT_FOUND_CODE = 404;
const VALIDATION_ERROR_CODE = 400;

module.exports.getAllCards = (req, res) => {
  // console.log(req.user._id); // _id пользователя прописан Хардверно - 632dd2b94ceb7519db223be0
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.send(cards))
    .catch(() => res.status(500).send({ message: 'На сервере произошла ошибка' }));
};

module.exports.createCard = (req, res) => {
  // console.log(req.user._id); // _id пользователя прописан Хардверно - 632dd2b94ceb7519db223be0
  const { name, link } = req.body;
  const ownerId = req.user._id;
  // res.send({ user: req.user._id });
  Card.create({ name, link, owner: ownerId })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(VALIDATION_ERROR_CODE).send({ message: 'Переданы некорректные данные при создании карточки.' });
        return;
      }
      res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.deleteCard = (req, res) => {
  // const cardId = req.params.cardId;
  // res.send({ user: req.user._id });
  Card.findByIdAndRemove(req.params.cardId)
    .populate('owner')
    .then(() => res.status(301).send({ message: ` Карточка с _id: ${req.params.cardId} удалена` }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(NOT_FOUND_CODE).send({ message: `Карточка с указанным _id: ${req.params.cardId} не найдена.` });
        return;
      }
      res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .populate(['likes', 'owner'])
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(NOT_FOUND_CODE).send({ message: `Передан несуществующий _id: ${req.params.cardId} карточки` });
        return;
      }
      if (err.name === 'ValidationError') {
        res.status(VALIDATION_ERROR_CODE).send({ message: 'Переданы некорректные данные для постановки лайка' });
        return;
      }
      res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(NOT_FOUND_CODE).send({ message: `Передан несуществующий _id: ${req.params.cardId} карточки` });
        return;
      }
      if (err.name === 'ValidationError') {
        res.status(VALIDATION_ERROR_CODE).send({ message: 'Переданы некорректные данные для снятия лайка' });
        return;
      }
      res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
};
