const { HTTP_STATUS_CREATED } = require('http2').constants;
const mongoose = require('mongoose');
const User = require('../models/user');
const BadRequestError = require('../errors/badRequestError');
const NotFoundError = require('../errors/notFoundError');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

module.exports.getUserByID = (req, res, next) => {
  User.findById(req.params.userID)
    .orFail()
    .then((user) => res.send(user))
    .catch((error) => {
      if (error instanceof mongoose.Error.CastError) {
        return next(new BadRequestError('Указан некорректный ID'));
      }
      if (error instanceof mongoose.Error.DocumentNotFoundError) {
        return next(new NotFoundError('Пользователь с таким ID не найден'));
      }
      return next(error);
    });
};

module.exports.addUser = (req, res, next) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(HTTP_STATUS_CREATED).send(user))
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        return next(new BadRequestError('Проверьте правильность заполнения полей'));
      }
      return next(error);
    });
};

module.exports.editUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail()
    .then((user) => res.send(user))
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        return next(new BadRequestError('Проверьте правильность заполнения полей'));
      }
      if (error instanceof mongoose.Error.DocumentNotFoundError) {
        return next(new NotFoundError('Пользователь с таким ID не найден'));
      }
      return next(error);
    });
};

module.exports.editUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail()
    .then((user) => res.send(user))
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        return next(new BadRequestError('Проверьте правильность заполнения полей'));
      }
      if (error instanceof mongoose.Error.DocumentNotFoundError) {
        return next(new NotFoundError('Пользователь с таким ID не найден'));
      }
      return next(error);
    });
};
