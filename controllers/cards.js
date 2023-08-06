const {
  HTTP_STATUS_CREATED,
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
} = require('http2').constants;
const mongoose = require('mongoose');
const modelCard = require('../models/card');

module.exports.getCards = (req, res) => {
  modelCard.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.send(cards))
    .catch(() => res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' }));
};

module.exports.addCard = (req, res) => {
  const { name, link } = req.body;
  modelCard.create({ name, link, owner: req.user._id })
    .then((card) => {
      modelCard.findById(card._id)
        .populate('owner')
        .then((data) => res.status(HTTP_STATUS_CREATED).send(data))
        .catch(() => res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Карточка не найдена' }));
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(HTTP_STATUS_BAD_REQUEST).send({ message: error.message });
      } else {
        res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  modelCard.findByIdAndRemove(req.params.cardID)
    .then((card) => {
      if (!card) {
        res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Карточка не найдена' });
        return;
      }
      res.send({ message: 'Карточка удалена' });
    })
    .catch(() => res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Некорректный запрос' }));
};

module.exports.likeCard = (req, res) => {
  modelCard.findByIdAndUpdate(req.params.cardID, { $addToSet: { likes: req.user._id } }, { new: true })
    .populate(['owner', 'likes'])
    .then((card) => {
      if (!card) {
        res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Карточка не найдена' });
        return;
      }
      res.send(card);
    })
    .catch(() => res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Некорректный запрос' }));
};

module.exports.dislikeCard = (req, res) => {
  modelCard.findByIdAndUpdate(req.params.cardID, { $pull: { likes: req.user._id } }, { new: true })
    .populate(['owner', 'likes'])
    .then((card) => {
      if (!card) {
        res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Карточка не найдена' });
        return;
      }
      res.send(card);
    })
    .catch(() => res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Некорректный запрос' }));
};
