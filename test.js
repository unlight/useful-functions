var selfPath = "./";
var deverror = require(selfPath);
var exceptionHandler = library.exceptionHandler;
var http = require('http');
var server = http.createServer();
var ServerResponse = http.ServerResponse;
var log = require('util').log;

global.d = library.d;

server.on('request', function(request, response) {
	_RESPONSE = response;
	//response.write('Hello...');
	throw ("Something goes wrong");
	response.end('Bye.');
});
server.listen(8080, "127.0.0.1");
log("Server running at http://127.0.0.1:8080/");
process.on('uncaughtException', exceptionHandler);