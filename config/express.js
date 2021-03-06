const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const routes = require('../index.route');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Enable CORS - Cross Origin Resource Sharing.
app.use(cors());

// My auth middleware
const checkAuth = (req, res, next) => {
  if (typeof req.cookies.lovaToken === 'undefined' || req.cookies.lovaToken === null) {
    // eslint-disable-next-line no-param-reassign
    req.user = null;
  } else {
    const token = req.cookies.lovaToken;
    const decodedToken = jwt.decode(token, {
      complete: true
    }) || {};
    // eslint-disable-next-line no-param-reassign
    req.user = decodedToken.payload;
  }

  next();
};
app.use(checkAuth);

// Mount all routes on /api path.
app.use('/api', routes);

// #TODO: Additional non-API routes go here.

module.exports = app;
