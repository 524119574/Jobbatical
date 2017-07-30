var app = require('../index.js');
var supertest = require('supertest');
var request = supertest(app);
var should = require('should');

describe('index.js', function() {
	it('should be able to get all the jobs', function(done) {
		request.get('/api/v1/jobs')
			.end(function(err, res) {
				res.status.should.equal(200);
				should.not.exist(err);
				res.body.should.be.an.instanceof(Array);
				done();
			});
	});

	it('should be able to add new job', function(done) {
		request.get('/api/v1/jobs')
			.end(function(err, res) {
				var previousLen = res.body.length;
				request.post('/api/v1/job')
					.send({'title': 'CEO of Microsoft Inc.'})
					.end(function(err, doc) {
						request.get('/api/v1/jobs')
							.end(function(err, res) {
								res.body.length.should.be.equal(previousLen+1);
							})
					})
			})
		done();
	})
})