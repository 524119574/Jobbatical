var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').Strategy;

function googleAuth(user, router) {
	passport.serializeUser(function(user, done) {
		done(null, user._id);
	});

	passport.deserializeUser(function(id, done) {
		User.findOne({_id: id}).exe(done);
	});

	passport.use(new GoogleStrategy({
		consumerKey: '1005139624609-um7ecs71ta2dj52c3snfosrlj3nebs5u.apps.googleusercontent.com',
		consumerSecret: 'rzlIgt27wlTjxB3mQ7HOiiql',
		clientID: '1005139624609-um7ecs71ta2dj52c3snfosrlj3nebs5u.apps.googleusercontent.com',
		clientSecret: 'rzlIgt27wlTjxB3mQ7HOiiql',
		callbackURL: 'http://localhost:3000/auth/google/callback',
		passReqToCallback   : true
	},
	function(request, accessToken, refreshToken, profile, done) {
		if (!profile.email || !profile.email.length) {
			return done("No email associated with this account");
		}

		User.findOneAndUpdate({
			'data.oauth': profile.id
		},
		{
			$set: {
				'profile.email': profile.emails[0].value,
			}
		},
		{
			'new': true, upsert: true, runValidator: true
		},
		function(error, user) {
			done(error, user);
		})
	}));

	router.use(require('express-session')({secret: 'I am very handsome!!!', resave: false, saveUninitialized: false}));

	router.use(passport.initialize());
	router.use(passport.initialize());
	router.use(passport.session());

	router.get('/auth/google', passport.authenticate('google', { scope: [
       'https://accounts.google.com/OAuthGetRequestToken',
       'https://www.googleapis.com/auth/plus.profile.emails.read'] 
}));
	router.get('/auth/google/callback', passport.authenticate('google', {failureRedirect: '/fail'}), function(req, res) {
		res.send('Welcome ' + req.user.profile.email);
	});		
}

module.exports = googleAuth;



