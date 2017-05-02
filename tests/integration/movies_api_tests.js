var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();
var server = require('../../server');
var expect = chai.expect;
chai.use(chaiHttp);


describe('movies api testing...', function() {
	it('should list ALL movies on /movies GET', function(done) {
	    chai.request("http://localhost:3000")
			.get('/movies')
			.end(function (err, res) {
			    
				res.should.have.status(200);
			    res.should.be.json;
			    //expect(res).to.have.status(200);
				done();
			});
	});

});