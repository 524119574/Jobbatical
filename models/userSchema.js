var mongoose = require('mongoose');

module.exports = new mongoose.Schema({
	profile: {
		email: {type: String, required: true, lowercase: true}
	},
	data: {
		oauth: {type: String, required: true}
	}
});