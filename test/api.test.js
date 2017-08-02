var app = require('../index.js');
var supertest = require('supertest');
var request = supertest(app);
var should = require('should');

describe('routers/router.js', function() {
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
	});

	describe('register function', function() {
		it('should report an error when nothing is pass to it', function(done) {
			request.post('/api/v1/register')
				.end(function(err, res) {
					// to be filled in
				})
		});

		it('should report an error when missing email', function(done) {
			// to be filled in
		});

		it('should report an error when missing password', function(done) {
			// to be filled in
		});

		it('should report an error when password length is less than 8', function(done) {
			// to be filled in
		});

		it('should report an error when passowrd length is greater than 100', function(done) {
			// to be filled in
		});

		it('should check for invalid email in the payload', function(done) {
			request.post('/api/v1/register')
				.send({'email': 'askdfjlksdkjf.com'})
				.end(function(err, res) {
					res.body.length.should.not.be.equal(0);
				})
			done()
		});

		it('should report an error when email address is already on the database', function(done) {
			// to be filled in
		});

	});

	describe('login function', function() {
		it('should logged in the user if the user profile is on the database', function() {

		});

		it('should report an error if the passoword is incorrect', function() {

		})

		it('should report an error if the email is not in the databse', function() {

		});
	});
})