/* index.js */
'use strict';

const LineProtoTransformer = require('./lib/lineproto/index.js');
const AJV = require('ajv');

function Metrics ( outstream, options ) {

	if ( !outstream || !outstream.writable ) throw new Error('outstream argument is required and must be WriteStream');
	var _outstream = outstream;
	var _options = options || {};
	var _lpstream = new LineProtoTransformer();
	var _metricschema = {
		type: "object",
		properties: {
			measurement:{ "type":"string" },
			fields:{
				type:"object",
				additionalProperties:{ type:["string","number"] }
			},
			tags:{
				type:"object",
				additionalProperties:{ "type":["string","number"] }
			},
			ts:{ "type":"number" }
		}, required: ["measurement","fields","ts"]
	};
	var _ajv = new AJV(this._options);
	var _jsvalidator = _ajv.compile(_metricschema);
	_lpstream.pipe(_outstream);

	this.metricschema = function () {
		return _metricschema;
	}

	this.options = function () {
		return _options;
	}

	this.validateMetric = function ( metric ) {
		let valid = _jsvalidator( metric );
		if ( valid ) return true;
		else return _jsvalidator.errors;
	}

	this.pushMetric = function ( metric, next ) {
		if ( next ) {
			if ( typeof next == 'function' ) {
				try {
					var valid = this.validateMetric(metric);
					if ( valid == true ) {
						_lpstream.pushmetric( metric );
						return next (null, true);
					} else {
						return ( new Error('metric does not conform to json-to-line-protocol schema', valid.errors, _metricschema) );
					}
				} catch ( e ) {
					return ( e );
				}
			} else throw new Error("callback 'next' is not a function");
		} else {
			try {
				var valid = this.validateMetric(metric);
				if ( valid == true ) {
					_lpstream.pushmetric( metric );
					return true;
				} else {
					throw new Error('metric does not conform to json-to-line-protocol schema', valid.errors, _metricschema);
				}		
			} catch ( e ) {
				throw e;
			}
		}
	}

}

module.exports = Metrics;

