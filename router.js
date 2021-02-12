const Authentication = require('./controllers/authentication');
const passportService = require('./services/passport');
const passport = require('passport');

const requireAuth = passport.authenticate('jwt', { session: false }); // session: false -> no cookies
const requireSignin = passport.authenticate('local', { session: false });

module.exports = function(app) {
  app.get('/', requireAuth, (req, res) => res.send('hi'));
  app.post('/signin', requireSignin, Authentication.signin);
  app.post('/signup', Authentication.signup);
};
