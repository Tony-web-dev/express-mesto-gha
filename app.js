const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { errors } = require('celebrate');
const mongoose = require('mongoose');
const NotFoundError = require('./errors/notFoundError');
const auth = require('./middlewares/auth');
const { PORT, DataBaseURL } = require('./utils/constants');
const handleError = require('./middlewares/handleError');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60,
});
app.use(limiter);

mongoose.connect(DataBaseURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use('/signup', require('./routes/signup'));
app.use('/signin', require('./routes/signin'));

app.use(auth);
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use('*', (req, res, next) => next(new NotFoundError('Страница не найдена')));

app.use(errors());
app.use(handleError);

app.listen(PORT);
