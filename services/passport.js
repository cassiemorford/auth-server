const passport = require('passport');
const User = require('../models/user');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');

// create local strategy
const localOptions = { usernameField: 'email' };
const localLogin = new LocalStrategy(localOptions, (email, password, done) => {
  // verify username & password
  User.findOne({ email }, (err, user) => {
    if (err) return done(err);
    if (!user) return done(null, false);
    //compare passwords
    user.comparePassword(password, (err, isMatch) => {
      if (err) return done(err);
      if (!isMatch) return done(null, false);
      return done(null, user);
    });
  });
});

// set up options for jwt strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.secret,
};

// create jwt strategy
const jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {
  // see if user ID in the payload exists in our DB
  User.findById(payload.sub, (err, user) => {
    if (err) return done(err, false);
    if (user) return done(null, user);
    return done(null, false);
  });
  // call 'done' with user if exists, otherwise without a user object
});

// tell passport to use this strategy
passport.use(jwtLogin);
passport.use(localLogin);
