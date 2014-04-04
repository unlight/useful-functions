var wru = require('wru');
var collection = [];
var functions = require('./..');
var colorize = functions.colorize;


collection[collection.length] = function() {
	console.log(colorize("^2Hello ^3World!"));
	console.log(colorize("^1Hello ^5World ^4Awesome!"));
	console.log(colorize("^6Hello ^7World ^8Awesome!"));
	console.log(colorize("^9Hello"));
	console.log(colorize("^8Hello"));
	console.log(colorize("^9Hello"));
	console.log(colorize("^4Hello"));
	console.log(colorize("^5Hello"));
	console.log(colorize("^6Hello"));
	console.log(colorize("^1Hello"));
	console.log(colorize("^2Hello"));
	console.log(colorize("^3Hello"));
	wru.assert(true);
};
wru.test(collection);