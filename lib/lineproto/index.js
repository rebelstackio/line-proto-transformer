/* lib/lineproto/index.js */
'use strict';
/* inspiration and attribution to https://github.com/evanshortiss/node-json-to-influx-line/blob/master/util.js under MIT license. */

const { Transform } = require('stream');

class LineProtoTransformer extends Transform {

	constructor ( options ) {
		super( options );
		this.SPACE_REPLACER = [new RegExp(' ', 'gi'), '\\ '];
		this.COMMA_REPLACER = [new RegExp(',', 'gi'), '\\,'];
		this.EQUAL_REPLACER = [new RegExp('=', 'gi'), '\\='];
		this.FIELD_TAG_REPLACERS = [ this.SPACE_REPLACER, this.COMMA_REPLACER, this.EQUAL_REPLACER ];
		this.MEASURE_REPLACERS = [ this.SPACE_REPLACER, this.COMMA_REPLACER ];
	}

	escapeChars ( replacers, input ) {
		if ( typeof input == 'string' ) {
			for ( let r in replacers ) {
				input = input.replace(replacers[r][0], replacers[r][1]);
			}
		}
		return input;
	}

	generateTagString (data, keys) {
		let ret = '';
		keys = keys || Object.keys(data);
		if (keys.length > 0) {
			for (let i in keys) {
				ret += this.escapeChars( this.FIELD_TAG_REPLACERS, keys[i]) + '=' + this.escapeChars( this.FIELD_TAG_REPLACERS, data[keys[i]] ) + ',';
			}
			ret = ret.slice(0, -1);
		}
		return ret;
	};

	generateFieldString (data, keys) {
		var ret = '';
		keys = keys || Object.keys(data);
		if (keys.length > 0) {
			for (var i in keys) {
				ret += this.escapeChars( this.FIELD_TAG_REPLACERS, keys[i]) + '=' + data[keys[i]] + ',';
			}
			ret = ret.slice(0, -1);
		}
		return ret;
	};

	generateLineProtocolString (params) {
		if ( params.ts ) { params.ts = ' ' + params.ts; }
		else { params.ts = ''; }
		if ( params.tags && Object.keys(params.tags).length !== 0) { params.tags = ',' + this.generateTagString(params.tags); }
		else { params.tags = ''; }
		return ( this.escapeChars(this.MEASURE_REPLACERS, params.measurement) + params.tags + ' ' + this.generateFieldString(params.fields) + params.ts );
	}

	pushmetric ( metricobj ) {
		this.write( JSON.stringify(metricobj) );
	}

	_transform ( metricjson, enc, cb) {
		let transformed = this.generateLineProtocolString( JSON.parse(metricjson) ) + "\n";
		cb(null,transformed);
	}

}

module.exports = LineProtoTransformer;
