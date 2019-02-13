const jwt = require('jsonwebtoken');

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

module.export = checkAuth;
