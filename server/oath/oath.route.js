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

router.get('/', (req, res) => {
  Oath.find({userID: req.user})
    .then((oaths) => {
      req.status(200).send(oaths);
    }).catch((err) => {
      console.log(err);
      res.status(400).send(err)
    })
})

router.post('/', (req, res) => {
  const newOath = new Oath(req.body);
  User.findById(req.user)
    .then((user) => {
      newOath.user = user._id;
      newOath.save()
        .then((oath) => {
          user.oaths.unshift(oath);
          user.markModified('oaths');
          user.save()
            .then(() => {
              res.status(200).send(oath);
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

router.put('/:oathId/:newUserId', (req, res) => {
  User.findById(req.params.newDirectorId)
    .then((newUser) => {
      if (newUser) {
        oath.findById(req.params.oathId)
          .then((oath) => {
            if (oath) {
              oath.users.unshift(newUser);
              oath.markModified('users');
              oath.save();
              newUser.oaths.unshift(oath);
              newUser.markModified('oaths');
              newUser.save();
              res.status(200).send(oath);
            } else {
              throw new Error('oath doesn\'t exist');
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

router.delete('/:oathId', (req, res) => {
  oath.findById(req.params.oathId)
    .populate('users')
    .then((oath) => {
      if (oath) {
        for (let i = 0; i < oath.users.length; i += 1) {
          const editoath = oath;
          editoath.users[i].oaths =
            oath.users[i].oaths.filter(filteroath => filteroath._id !== oath._id);
          oath.markModified('users');
          oath.save();
        }
        return oath.findOneAndRemove({
          id: oath._id
        });
      }
      throw new Error('Could not find oath');
    }).then((oath) => {
      res.status(200).send(oath);
    })
    .cathc((err) => {
      console.error(err);
      res.status(400).send(err);
    });
});

module.exports = router;
