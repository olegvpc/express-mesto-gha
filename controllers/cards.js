const Card = require('../models/card');

const { ValidationError } = require('../errors/validation-error');
const { NotFoundError } = require('../errors/not-found-error');
const { ForbiddenError } = require('../errors/forbidden-error');

module.exports.getAllCards = (req, res, next) => {
  // console.log(req.user._id); // _id пользователя прописан Хардверно - 632dd2b94ceb7519db223be0
  Card.find({})
    // .populate(['owner', 'likes'])
    .then((cards) => res.send(cards))
    .catch(next); //  то же самое что .catch(err => next(err));
};

module.exports.createCard = (req, res, next) => {
  // console.log(req.user._id); // _id пользователя прописан Хардверно - 632dd2b94ceb7519db223be0
  const { name, link } = req.body;
  const ownerId = req.user._id;
  Card.create({ name, link, owner: ownerId })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const error = new ValidationError(`Переданы некорректные данные при создании карточки. - ${err.message}`);
        return next(error);
      }
      return next(err);
    });
};

module.exports.deleteCard = (req, res, next) => {
  // const cardId = req.params.cardId;
  // res.send({ user: req.user._id });
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new Error('Карточка не найдена');
      }
      // console.log(card.owner.toString(), req.user._id);
      if (card.owner.toString() !== req.user._id) {
        throw new ForbiddenError('Нельзя удалить чужую карточку');
      } else {
        Card.findByIdAndRemove(req.params.cardId)
        // .populate('owner')
          .then(() => {
            res.send({ message: ` Карточка с _id: ${req.params.cardId} удалена` });
          });
      }
    })
    .catch((err) => {
      if (err.statusCode === 403) {
        const error = new ForbiddenError(`Нельзя удалить чужую карточку ${err.statusCode}`);
        return next(error);
      }
      if (err.name === 'CastError') {
        const error = new ValidationError(`Передан некорректный _id: ${req.params.cardId} карточки. ${err.name}`);
        return next(error);
      }
      if (err.name === 'Error') {
        const error = new NotFoundError(`Карточка с указанным _id: ${req.params.cardId} не найдена.${err.name} `);
        return next(error);
      }
      return next(err);
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    // .populate(['likes', 'owner'])
    .then((card) => {
      if (!card) {
        throw new Error('Карточка не найдена');
      } else {
        res.send(card);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        const error = new ValidationError(`Передан некорректный _id: ${req.params.cardId} карточки ${err.name}`);
        return next(error);
      }
      if (err.name === 'Error') {
        const error = new NotFoundError(`Карточка с указанным _id: ${req.params.cardId} не найдена.${err.name}`);
        return next(error);
      }
      if (err.name === 'ValidationError') {
        const error = new ValidationError('Переданы некорректные данные для постановки лайка');
        return next(error);
      }
      return next(err);
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    // .populate(['owner', 'likes'])
    .then((card) => {
      if (!card) {
        throw new Error('Карточка не найдена');
      } else {
        res.send(card);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        const error = new ValidationError(`Передан некорректный _id: ${req.params.cardId} карточки ${err.name}`);
        return next(error);
      }
      if (err.name === 'Error') {
        const error = new NotFoundError(`Карточка с указанным _id: ${req.params.cardId} не найдена.${err.name}`);
        return next(error);
      }
      if (err.name === 'ValidationError') {
        const error = new ValidationError('Переданы некорректные данные для постановки лайка');
        return next(error);
      }
      return next(err);
    });
};
