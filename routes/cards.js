const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const regex = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)$/;
const {
  getCards, addCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

router.get('/', getCards);

router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(regex),
  }),
}), addCard);

router.delete('/:cardID', celebrate({
  params: Joi.object().keys({
    cardID: Joi.string().length(24).hex().required(),
  }),
}), deleteCard);

router.put('/:cardID/likes', celebrate({
  params: Joi.object().keys({
    cardID: Joi.string().length(24).hex().required(),
  }),
}), likeCard);

router.delete('/:cardID/likes', celebrate({
  params: Joi.object().keys({
    cardID: Joi.string().length(24).hex().required(),
  }),
}), dislikeCard);

module.exports = router;
