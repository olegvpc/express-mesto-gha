const Card = require('../models/card');

const { ValidationError } = require('../errors/validation-error');
const { NotFoundError } = require('../errors/not-found-error');
const { ForbiddenError } = require('../errors/forbidden-error');

module.exports.getAllCards = (req, res, next) => {
  Card.find({})
    // .populate(['owner', 'likes'])
    .then((cards) => res.send(cards))
    .catch(next); //  то же самое что .catch(err => next(err));
};

module.exports.createCard = (req, res, next) => {
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
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError(`Карточка с указанным _id: ${req.params.cardId} не найдена.`);
      }
      if (card.owner.toString() !== req.user._id) {
        throw new ForbiddenError('Нельзя удалить чужую карточку');
      }
      Card.findByIdAndRemove(req.params.cardId)
      // .populate('owner')
        .then(() => {
          res.send({ message: ` Карточка с _id: ${req.params.cardId} удалена` });
        });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        const error = new ValidationError(`Передан некорректный _id: ${req.params.cardId} карточки. ${err.name}`);
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
        throw new NotFoundError(`Карточка с указанным _id: ${req.params.cardId} не найдена.`);
      } else {
        res.send(card);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        const error = new ValidationError(`Передан некорректный _id: ${req.params.cardId} карточки ${err.name}`);
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
        throw new NotFoundError(`Карточка с указанным _id: ${req.params.cardId} не найдена.`);
      } else {
        res.send(card);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        const error = new ValidationError(`Передан некорректный _id: ${req.params.cardId} карточки ${err.name}`);
        return next(error);
      }
      if (err.name === 'ValidationError') {
        const error = new ValidationError('Переданы некорректные данные для постановки лайка');
        return next(error);
      }
      return next(err);
    });
};
