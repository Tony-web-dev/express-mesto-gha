const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const regex = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)$/;
const {
  getUsers, getUserMe, getUserByID, editUser, editUserAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getUserMe);

router.get('/:userID', celebrate({
  params: Joi.object().keys({
    userID: Joi.string().length(24).hex().required(),
  }),
}), getUserByID);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), editUser);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(regex),
  }),
}), editUserAvatar);

module.exports = router;
