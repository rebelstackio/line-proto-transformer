# lib/lineproto

A nodejs stream.Transform that converts a metric object to influx line protocol.

## Sample Usage

```js
const LineProtoTransformer = require('lib/lineproto/index.js');
const testtrans = new LineProtoTransformer();
testtrans.pipe(process.stdout); // this could be any writable stream
testtrans.pushmetric( { measurement:'test', tags:{ tag:"tagval"}, fields:{ field:"fieldval" } } );
```

