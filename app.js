const { HTTP_STATUS_NOT_FOUND } = require('http2').constants;
const express = require('express');
const mongoose = require('mongoose');

const { PORT = 3000, DataBaseURL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(DataBaseURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use((req, res, next) => {
  req.user = {
    _id: '64da6da1b5f052a6c183c530',
  };
  next();
});

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use('*', (req, res) => {
  res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Страница не найдена' });
});

app.use((error, req, res, next) => {
  const { statusCode = 500, message } = error;
  res.status(statusCode).send({
    message: statusCode === 500
      ? 'На сервере произошла ошибка'
      : message,
  });
  next();
});

app.listen(PORT);
