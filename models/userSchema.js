var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

module.exports = new mongoose.Schema({
	profile: {
		email: {type: String, required: true, lowercase: true},
		password: {type: String, required: true}
	},
	data: {
		oauth: {type: String}
	}
});

module.exports.createUser = function(newUser, callback) {
	var bcrypt = require('bcryptjs');
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(newUser.profile.password, salt, function(err, hash) {
	    	newUser.profile.password = hash;
	    	newUser.save(callback);
	        // Store hash in your password DB. 
	    });
	});
};

module.exports.comparePassword = function(password, hash) {
	bcrypt.compare(password, hash, function(err, res) {
	if (!err) {
		return res;
	}else {
		throw 'error in compare password';
	}
	});
}