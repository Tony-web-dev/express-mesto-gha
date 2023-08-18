const {
  SECRET_KEY = 'df3bc0dda92c600fd937964f4d468230f04019a514b1234e3a033b105e91eab1',
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
