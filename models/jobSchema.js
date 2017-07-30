var mongoose = require('mongoose');
var Category = require('./companySchema');

var jobSchema = {
	jobTitle: {type: String, required: true},
	endDate: {type: Date},
	isJobAvailableImmediately: Boolean,
	jobAvailableDate: {type: Date},
	image: {type: String},
	// decoration image for the jobs
	location: {type: String},
	tags: [{type: String}],
	responsibilities: [{type: String}],
	requirements: [{type: String}],
	// opening is the opening-intro in the thumbnail view of the job
	opening: {type: String},
	compensation: [{type: String}],
	jobDescription: {type: String},
	company: Category.categorySchema
};

module.exports = new mongoose.Schema(jobSchema);
module.exports.jobSchema = jobSchema;

