function setupAuth(User, router) {
  var passport = require('passport');
  var FacebookStrategy = require('passport-facebook').Strategy;

  // High level serialize/de-serialize configuration for passport
  passport.serializeUser(function(user, done) {
    done(null, user._id);
  });

  passport.deserializeUser(function(id, done) {
    User.
      findOne({ _id : id }).
      exec(done);
  });

  // Facebook-specific
  passport.use(new FacebookStrategy(
    {
      clientID: '1039043219532268',
      clientSecret: 'bbdc0006e541c89b7cb0946e75c6618b',
      callbackURL: 'http://localhost:3000/api/v1/auth/facebook/callback',
      profileFields: ['id', 'email', 'gender', 'link', 'locale', 'name', 'timezone', 'updated_time', 'verified']
    },
    function(accessToken, refreshToken, profile, done) {
      if (!profile.emails || !profile.emails.length) {
        console.log(profile);
        return done('No emails associated with this account!');
      }

      User.findOneAndUpdate(
        { 'data.oauth': profile.id },
        {
          $set: {
            'profile.email': profile.emails[0].value,
          }
        },
        { 'new': true, upsert: true, runValidators: true },
        function(error, user) {
          console.log(user);
          done(error, user);
        });
    }));

  // Express middlewares
  router.use(require('express-session')({
    secret: 'I am very handsome!!!', 
    resave: false, 
    saveUninitialized: false}));
  router.use(passport.initialize());
  router.use(passport.session());

  // Express routes for auth
  router.get('/auth/facebook',
    passport.authenticate('facebook', { scope: ['email'] }));

  router.get('/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/fail' }),
    function(req, res) {
      console.log(req.user.profile);
      res.send('Welcome, ' + req.user.profile.email);
    });
}

module.exports = setupAuth;
