function setupAuth(User, router) {
  var passport = require('passport');
  var GithubStrategy = require('passport-github').Strategy;

  // High level serialize/de-serialize configuration for passport
  passport.serializeUser(function(user, done) {
    done(null, user._id);
  });

  passport.deserializeUser(function(id, done) {
    User.
      findOne({ _id : id }).
      exec(done);
  });

  // Github-specific
  passport.use(new GithubStrategy(
    {
      clientID: 'f013a6d45c339c19045a',
      clientSecret: '55dd59c37c47dc091de51de9c00d4377b0e41d9b',
      callbackURL: 'http://localhost:3000/api/v1/auth/github/callback',
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
  router.get('/auth/github',
    passport.authenticate('github', { scope: ['email'] }));

  router.get('/auth/github/callback',
    passport.authenticate('github', { failureRedirect: '/fail' }),
    function(req, res) {
      console.log(req.user.profile);
      res.send('Welcome, ' + req.user.profile.email);
    });
}

module.exports = setupAuth;
