const {
  HTTP_STATUS_CREATED,
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
} = require('http2').constants;
const mongoose = require('mongoose');
const modelUser = require('../models/user');

module.exports.getUsers = (req, res) => {
  modelUser.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' }));
};

module.exports.getUserByID = (req, res) => {
  modelUser.findById(req.params.userID)
    .orFail()
    .then((user) => res.send(user))
    .catch((error) => {
      if (error instanceof mongoose.Error.CastError) {
        return res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Указан некорректный ID' });
      }
      if (error instanceof mongoose.Error.DocumentNotFoundError) {
        return res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Пользователь с таким ID не найден' });
      }
      return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.addUser = (req, res) => {
  const { name, about, avatar } = req.body;
  modelUser.create({ name, about, avatar })
    .then((user) => res.status(HTTP_STATUS_CREATED).send(user))
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(HTTP_STATUS_BAD_REQUEST).send({ message: error.message });
      } else {
        res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.editUser = (req, res) => {
  const { name, about } = req.body;
  modelUser.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail()
    .then((user) => res.send(user))
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        return res.status(HTTP_STATUS_BAD_REQUEST).send({ message: error.message });
      }
      if (error instanceof mongoose.Error.DocumentNotFoundError) {
        return res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Пользователь с таким ID не найден' });
      }
      return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
});
};

module.exports.editUserAvatar = (req, res) => {
  const { avatar } = req.body;
  if (req.user._id) {
    modelUser.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
      .then((user) => res.send(user))
      .catch((error) => {
        if (error instanceof mongoose.Error.ValidationError) {
          res.status(HTTP_STATUS_BAD_REQUEST).send({ message: error.message });
        } else {
          res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Пользователь с таким ID не найден' });
        }
      });
  } else {
    res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
  }
};
