'use strict';

const Metrics = require('../index.js');
const fs = require('fs');
const chai = require('chai');
const should = chai.should();
const expect = chai.expect;
const assert = chai.assert;

describe('Metrics', function () {

	describe('#constructor', function () {
		it('should throw when missing outstream argument', function(){
			expect( function() { new Metrics() } ).to.throw();
		});
		it('should throw when outstream argument is not a writable stream', function (){
			expect( function() { new Metrics( "notwritablestream" ) }).to.throw();
		});
		it ('should return instance of Metrics object when passed writestream as outstream argument', function () {
			let ws = process.stdout; // fs.createWriteStream('/tmp/test');
			let metrics = new Metrics(ws);
			expect ( metrics ).to.be.instanceof(Metrics);
		});
	});

	describe('#validateMetric', function () {
		it('should return true when metric object is valid', function(){
			let metric = { measurement:"test", fields:{a:1}, ts:1234};
			let ws = process.stdout; // fs.createWriteStream('/tmp/test');
			let metrics = new Metrics(ws);
			expect( metrics.validateMetric(metric) ).to.be.true;
		});
		it('should return errors array when metric is invalid', function(){
			let metric = {};
			let ws = process.stdout; // fs.createWriteStream('/tmp/test');
			let metrics = new Metrics(ws);
			expect( metrics.validateMetric(metric) ).to.be.instanceof(Array);
		});
	});

	describe('#pushMetric sync to stream', function () {
		it('should write to stream', function(){
			let metric = { measurement:'name-of-measure',fields:{c:'2',d:3},tags:{a:'1',b:2},ts:Date.now()};
			let ws = process.stdout;
			let metrics = new Metrics(ws);
			expect( metrics.pushMetric(metric) ).to.be.true;
		});
	});

	describe('#pushMetric async to stream', function () {
		it('should write to stream', function( done ){
			let metric = { measurement:'name-of-measure',fields:{c:'2',d:3},tags:{a:'1',b:2},ts:Date.now()};
			let ws = process.stdout;
			let metrics = new Metrics(ws);
			metrics.pushMetric(metric, function( error, data ) {
				expect(data).to.be.true;
				done();
			});
		});
	});

});

