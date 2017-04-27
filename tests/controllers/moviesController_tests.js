var expect = require('chai').expect;
var sinon = require('sinon');
var	mongoose = require('mongoose');
var sinonMongoose = require('sinon-mongoose');
var model = require('../../models/moviesModel');

describe('Math', function() {
	describe('max', function() {
		it('returns the biggest number from the arguments', function() {
			var max = Math.max(1, 2, 10, 3);
			expect(max).to.equal(10);
		});
	});
});

describe('Movies Controller tests', function() {
	describe("list_all_movies", function() {
		it("should return all movies", function(done) {
			var movieMock = sinon.mock(model);
			// TODO ...in progress...
			done();
		});
	})
});