const modelCard = require('../models/card');

module.exports.getCards = (req, res) => {
  modelCard.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.send(cards))
    .catch(() => res.status(500).send({ message: 'На сервере произошла ошибка' }));
};

module.exports.addCard = (req, res) => {
  const { name, link } = req.body;
  modelCard.create({ name, link, owner: req.user._id })
    .then((card) => {
      modelCard.findById(card._id)
        .populate('owner')
        .then((data) => res.status(201).send(data))
        .catch(() => res.status(404).send({ message: 'Карточка не найдена' }));
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(400).send({ message: error.message });
      } else {
        res.status(500).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  modelCard.findByIdAndRemove(req.params.cardID)
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Карточка не найдена' });
        return;
      }
      res.send({ message: 'Карточка удалена' });
    })
    .catch(() => res.status(404).send({ message: 'Карточка не найдена' }));
};

module.exports.likeCard = (req, res) => {
  modelCard.findByIdAndUpdate(req.params.cardID, { $addToSet: { likes: req.user._id } }, { new: true })
    .populate(['owner', 'likes'])
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Карточка не найдена' });
        return;
      }
      res.send(card);
    })
    .catch(() => res.status(404).send({ message: 'Карточка не найдена' }));
};

module.exports.dislikeCard = (req, res) => {
  modelCard.findByIdAndUpdate(req.params.cardID, { $pull: { likes: req.user._id } }, { new: true })
    .populate(['owner', 'likes'])
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Карточка не найдена' });
        return;
      }
      res.send(card);
    })
    .catch(() => res.status(404).send({ message: 'Карточка не найдена' }));
};
