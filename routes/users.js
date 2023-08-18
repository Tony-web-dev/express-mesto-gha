const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUsers, getUserByID, getUserMe, editUser, editUserAvatar,
} = require('../controllers/users');
const { urlRegex } = require('../utils/constants');

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
    avatar: Joi.string().pattern(urlRegex),
  }),
}), editUserAvatar);

module.exports = router;
