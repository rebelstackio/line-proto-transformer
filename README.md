# line-proto-transformer
Stream transform json-formatted metrics to influx-line-protocol

Typically your host will already have telegraf installed which can be configured to watch a log file or unix socket. In combination with telegraf, this NodeJS Transformer will allow javascript objects to be transformed and streamed to a Node JS writable stream that can be monitored by telegraf to provide reliable delivery to influxdb.

## Usage
You can implement line-proto-transformer anywhere in your code where you want to emit metrics to be streamed to your unix socket or logfile being monitored by telegraf.

The not-recommended synchronous way:
```js
const ws = fs.createWriteStream('/path/to/socket/or/file/watched/by/telegraf');
const metrics = new Metrics(ws);
// not the recommended way because the code is synchronous - we otherwise want to move on quickly
let measurement = { measurement:"test", tags:{foo:"bar"} fields:{a:1}, ts:Date.now()};
metrics.push( measurement );
```

We want to quickly push metrics without holding up our main execution so we'll use simple asynchronous callbacks:
```js
const ws = fs.createWriteStream('/path/to/socket/or/file/watched/by/telegraf');
const metrics = new Metrics(ws);
// not the recommended way because the code is synchronous - we want to move on
let measurement = { measurement:"test", tags:{foo:"bar"} fields:{a:1}, ts:Date.now()};
metrics.push( measurement, function ( error ) { console.log("just quickly log the problem",error) } );
```

There is no good reason I can find to offer promises because we really want to brush by the metrics and not hold our breath for it's results.
