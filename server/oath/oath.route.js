const express = require('express');
const Oath = require('./oath.model');
const User = require('../auth/auth.model');

const router = new express.Router({
  mergeParams: true
});

router.route('/');

router.get('/:oathId', (req, res) => {
  Oath.findById(req.params.oathId)
    .then((oath) => {
      if (oath) {
        res.status(200).send(oath);
      } else {
        res.status(404).send('Oath not found');
      }
    }).catch((err) => {
      console.error(err);
      res.status(400).send(err);
    });
});

router.post('/', (req, res) => {
  const newPromise = new Promise(req.body);
  User.findById(req.params.userId)
    .then((user) => {
      newPromise.users = [user._id];
      newPromise.save()
        .then((promise) => {
          user.promises.unshift(promise);
          user.markModified('promises');
          user.save()
            .then(() => {
              res.status(200).send(user);
            }).catch((err) => {
              console.error(err);
              res.status(400).send(err);
            });
        }).catch((err) => {
          console.error(err);
          res.status(400).send(err);
        });
    }).catch((err) => {
      console.error(err);
      res.status(400).send(err);
    });
});

router.put('/:promiseId/:newUserId', (req, res) => {
  User.findById(req.params.newDirectorId)
    .then((newUser) => {
      if (newUser) {
        Promise.findById(req.params.promiseId)
          .then((promise) => {
            if (promise) {
              promise.users.unshift(newUser);
              promise.markModified('users');
              promise.save();
              newUser.promises.unshift(promise);
              newUser.markModified('promises');
              newUser.save();
              res.status(200).send(promise);
            } else {
              throw new Error('Promise doesn\'t exist');
            }
          }).catch((err) => {
            console.error(err);
            res.status(400).send(err);
          });
      } else {
        throw new Error('The User doesn\'t exist');
      }
    }).catch((err) => {
      console.error(err);
      res.status(400).send(err);
    });
});

router.delete('/:promiseId', (req, res) => {
  Promise.findById(req.params.promiseId)
    .populate('users')
    .then((promise) => {
      if (promise) {
        for (let i = 0; i < promise.users.length; i += 1) {
          const editPromise = promise;
          editPromise.users[i].promises =
            promise.users[i].promises.filter(filterPromise => filterPromise._id !== promise._id);
          promise.markModified('users');
          promise.save();
        }
        return Promise.findOneAndRemove({
          id: promise._id
        });
      }
      throw new Error('Could not find promise');
    }).then((promise) => {
      res.status(200).send(promise);
    })
    .cathc((err) => {
      console.error(err);
      res.status(400).send(err);
    });
});

module.exports = router;
