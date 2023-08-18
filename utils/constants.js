const {
  SECRET_KEY = 'some_key',
  PORT = 3000,
  DataBaseURL = 'mongodb://127.0.0.1:27017/mestodb',
} = process.env;
const urlRegex = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)$/;

module.exports = {
  SECRET_KEY,
  PORT,
  DataBaseURL,
  urlRegex,
};
