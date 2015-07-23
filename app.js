var config = {
  port: 3000,
  rethinkdb: {
    host: "127.0.0.1",
    port: 28015,
    db: "jibe"
  }
};

var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    jibe = require('jibe')({config: config});

// serve the static files in jibe-demo first
// this ensures jibe-demo's index.html is used
app.use(express.static(__dirname + '/public', {maxAge:31557600000}));

// initialize jibe, mount jibe router and browser channel
app.use(jibe.router(io));
app.use(jibe.browserChannelMiddleware);

// start server
server.listen (config.port, function () {
    console.info ('Server listening at port %d', config.port);
});
