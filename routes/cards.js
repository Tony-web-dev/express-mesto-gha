const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');
const { urlRegex } = require('../utils/constants');

router.get('/', getCards);
router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(urlRegex),
  }),
}), createCard);

// router.delete('/:cardID', celebrate({
//   params: Joi.object().keys({
//     cardID: Joi.string().length(24).hex().required(),
//   }),
// }), deleteCard);

router.delete('/:cardID', deleteCard);

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
