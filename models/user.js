const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
// const validator = require('validator');
// eslint-disable-next-line no-useless-escape
// const regex = /^(https?:\/\/)([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?#?$/gm;
// eslint-disable-next-line no-control-regex
// eslint-disable-next-line max-len
// const emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
// const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
// const isEmail = require('validator/lib/isEmail');
const isURL = require('validator/lib/isURL');

const userSchema = new mongoose.Schema({ // Создаю схему userSchema
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
    default: () => 'Enter youre name here',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
    default: () => 'Say something about you',
  },
  avatar: {
    type: String,
    validate: {
      validator: (v) => isURL(v),
      message: (props) => `${props.value} is not a valid URL!`,

      // validator: (v) => regex.test(v),
      // message: (props) => `${props.value} is not a valid URL!`, // console.log или alert
    },
    required: true,
    default: () => 'https://img2.freepng.ru/20180411/aye/kisspng-emoticon-smiley-computer-icons-laugh-5ace48537c39e4.6250520715234683715088.jpg',
  },
  email: {
    type: String,
    unique: true,
    require: true,
    // validate: {
    //   validator: (v) => isEmail(v),
    //   message: 'is not a valid email!',
    // },
    //   validator: (v) => emailRegex.test(v),
    //   message: (props) => `${props.value} is not a valid email! 0`,
    // },
  },
  password: {
    type: String,
    // validate: {
    //   validator: (v) => passwordRegex.test(v),
    //   message: (props) => `${props.value} is not a valid password! 00`,
    // },
    required: true,
    minlenght: 8,
    select: false, // Это свойство запрещает выводить хеш пароля
  },

});
// eslint-disable-next-line no-console
console.log('1');
const AuthError = require('../errors/auth-error');

// eslint-disable-next-line func-names
userSchema.statics.findUserByCredentials = function (email, password) {
  // eslint-disable-next-line no-console
  console.log('2');
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        // return Promise.reject(new Error('Неправильные почта или пароль 0'));
        throw new AuthError('Ошибка аутентификации1');
      }

      return bcrypt.compare(password, user.password)
        .then((compareOk) => {
          if (!compareOk) {
            // return Promise.reject(new Error('Неправильные почта или пароль 00'));
            throw new AuthError('Ошибка аутентификации2');
          }
          // eslint-disable-next-line no-console
          console.log('3 - пользователь найден в базе - user');
          // eslint-disable-next-line no-console
          console.log(user);
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
