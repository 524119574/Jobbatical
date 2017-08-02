// not currently in used...

var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = mongoose.model('User', require('../models/userSchema.js'));

module.exports = function(passport) {
	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done) {
		User.findById(id, function(err, user) {
			done(err, user);
		});
	});
	// I don't really understand this serialize and deserialize things...

	passport.use('local-signup', new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true
	},
	function(req, email, password, done) {
		process.nextTick(function() {
			User.findOne({'local.email': email}, function(err, user) {
				if (err) {
					return done(err);
				}

				if (user) {
					return done(null, false, req.flash('signupMessage', 'That email has already been taken'));
				}else {
					var newUser = new User();
					newUser.local.email = email;
					newUser.local.password = newUser.generateHash(password);

					newUser.save(function(err) {
						if (err) {
							throw err;
						}
						return done(null, newUser);
					});
				}
			})
		})
	}
	))

	passport.use('local-login', new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true
	},
	function(req, email, password, done) {
		User.findOne({'profile.email': email}, function(err, user) {
			if (err) {
				return done(err);
			}

			if (!user) {
				return done(null, false, req.flash('loginMessage', 'User dosen\'t exist...'))
			}

			if (!user.validPassword(password)) {
				return done(null, false, req.flash('loginMessage', 'Password is not correct'))
			}

			return done(null, user);
		});
	}));


};