const jwt = require('jsonwebtoken');
const config = require('../../config/config');
const bcrypt = require('bcryptjs');
const User = require('./auth.model');

function logUserIn(res, user) {
  const token = jwt.sign({
    _id: user.id
  }, config.jwtSecret, {
    expiresIn: '60 days'
  });
  res.cookie('lovaToken', token, {
    maxAge: 900000,
    httpOnly: true
  });
  res.status(200).send();
}

function authUser(username, password) {
  return new Promise((resolve, reject) => {
    User.findOne({
      username
    })
      .then((user) => {
        if (user) {
          comparePassword(password, user.password).then((match) => {
            if (match) {
              resolve(user);
            } else {
              reject('wrong username or password');
            }
          });
        } else {
          reject('wrong username or password');
        }
      }).catch((err) => {
        reject(err);
      });
  });
}

function comparePassword(inputPass, password) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(inputPass, password, (err, isMatch) => {
      if (err) {
        reject(err);
      } else {
        resolve(isMatch);
      }
    });
  });
}

function signUp(userData) {
  return new Promise((resolve, reject) => {
    const newUser = new User(userData);
    newUser.save().then((user) => {
      resolve(user);
    }).catch((error) => {
      reject(error);
    });
  });
}

module.exports = {
  logUserIn,
  authUser,
  signUp
};
