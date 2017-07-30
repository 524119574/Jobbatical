var mongoose = require('mongoose');

var companySchema = {
	name: {type: String},
	location: {type: String},
	size: {type: String},
	foundedDate: {type: Date},
	type: {type: String},
	description: {type: String},
	website: {type: String},
	Facebook: {type: String},
	Twitter: {type: String},
	LinkedIn: {type: String},
	GooglePlus: {type: String},
	LifeDescritpion: {type: String}
};

module.exports = new mongoose.Schema(companySchema);
module.exports.categorySchema = companySchema;
