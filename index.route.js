const express = require('express');
const authRoutes = require('./server/auth/auth.route');
const oathRoutes = require('./server/oath/oath.route');

const router = express.Router(); // eslint-disable-line new-cap

// #TODO: Change to your model.

router.use('/auth', authRoutes);
router.use('/promise', oathRoutes);

module.exports = router;
