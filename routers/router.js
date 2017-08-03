var router = require('express').Router();
var mongodb = require('mongodb');
var mongoose = require('mongoose');
var passport = require('passport');
var session = require('express-session');
var bodyParser = require('body-parser');
var Validator = require('jsonschema').Validator;
var connection = mongoose.connect('mongodb://localhost:27017/job', {
	useMongoClient: true // this is important, if not it dosen't seem to save the document
});
var Job = mongoose.model('Job', require('../models/jobSchema.js'));
var User = mongoose.model('User', require('../models/userSchema.js'));
var createUser = require('../models/userSchema.js').createUser;
var comparePassword = require('../models/userSchema.js').comparePassword;

var MongoClient = mongodb.MongoClient;

// You should change here when deploy
//(Focus on This Variable)
var url = 'mongodb://localhost:27017/job';      
//(Focus on This Variable)

router.use(bodyParser.urlencoded({
    extended: true
}));

/**bodyParser.json(options)
 * Parses the text as JSON and exposes the resulting object on req.body.
 */
router.use(bodyParser.json());

// require('./google-auth.js')(User, router);
require('./github-auth.js')(User, router);
require('./facebook-auth.js')(User, router);

router.get('/jobs', function(req, res) {
	Job.find({}, function(err, docs) {
		if (err) {throw err}
		console.log(docs);
		console.log(Object.prototype.toString.call(docs));
		res.send(docs);
	})
});

router.post('/job', function(req, res) {
	console.log(req.body.title);
	   	var job = new Job({'jobTitle': req.body.title});
	   	job.markModified('jobTitle');
	   	job.save(function(err) {
	    	if (err) {
	    		throw err
	    	}
	    	console.log('saved!')
	    });
});

router.post('/register', function(req, res) {
	var validation = validateRegisterJson(req.body);
	if (validation.errors.length === 0) {

		User.findOne({'profile.email': req.body.email}, function(err, user) {
			console.log(user);
			if (!user) {
				var newUser = new User({
					profile: {
						email: req.body.email,
						password: req.body.password
					}
				});


				createUser(newUser, function(err, user) {
					if (err) {throw err}
					console.log(user);
					res.status(200);
				})
			}else {
				console.log('email has been used');
				res.send('email has been used.')
			}
		})

	}else {
		res.send(validation.errors);
	}
})

router.post('/login', function(req, res) {
	var validation = validateRegisterJson(req.body);
	if (validation.errors.length === 0) {
		User.findOne({'profile.email': req.body.email}, function(err, user) {
			console.log(user);
			if (!user) {
				res.send('no user found')
			}else {
				if (comparePassword(req.body.password, user.profile.password)) {
					req.session.user = user;
					res.send('logged in successfully');
				}else {
					res.send('incorrect passowrd');
				}
			}
		})

	}else {
		res.send(validation.errors);
	}
});

router.get('/profile', function(req, res) {
	if(req.session.user) {
		res.status(200).send('welcome to your profile');
	}
	res.status(401).send();
});

function validateRegisterJson(json) {
	var v = new Validator();
	var registerSchema = {
    	"id": "/registerJson",
    	"type": "object",
    	"properties": {
       		"email": {
         	"type": "string",
         	"pattern": /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
         	"required": true
       		},
       		"password": {
       			"type": "string",
       			"minLength": 8,
       			"maxLength": 100,
	       		"required": true
  	   		}
    	}
  	};
  	console.log('validation result', v.validate(json, registerSchema).errors);
  	return v.validate(json, registerSchema);
}

module.exports = router;