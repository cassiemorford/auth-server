const jwt = require('jwt-simple');
const config = require('../config');
const User = require('../models/user');

const tokenForUser = user => {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
  // sub short for subject
  // iat short for "issued at time"
};

exports.signup = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password)
    res.status(422).send(`you must provide an email and password`);

  // does user already exist?
  User.findOne({ email }, (err, existingUser) => {
    if (err) return next(err);
    if (existingUser) {
      return res
        .status(422)
        .send({ error: `${existingUser.email} already exists.` });
    }

    // create new user
    const user = new User({ email, password });
    user.save(err => {
      next(err);
      res.send({ token: tokenForUser(user) });
    });
  });
};

exports.signin = (req, res, next) => {
  // email and password have been authed, they just need a token
  res.send({ token: tokenForUser(req.user) });
};
