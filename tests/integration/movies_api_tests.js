var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();
var server = require('../../server');

chai.use(chaiHttp);

describe('movies api testing...', function() {
	it('should list ALL movies on /movies GET', function(done) {
		chai.request(server)
			.get('/movies')
			.end(function(err, res){
				res.should.have.status(200);
				res.should.be.json;
				done();
			});
	});

});