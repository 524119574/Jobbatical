var router = require('express').Router();
var mongodb = require('mongodb');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var connection = mongoose.connect('mongodb://localhost:27017/job', {
	useMongoClient: true // this is important, if not it dosen't seem to save the document
});
var Job = mongoose.model('Job', require('../models/jobSchema.js'));

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
module.exports = router;