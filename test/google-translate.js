var wru = require('wru');
var collection = [];
var functions = require('./..');
var googleTranslate = functions.googleTranslate;

collection.push({
	name: "Google translate",
	test: function() {
		wru.assert("Function exists", typeof googleTranslate == "function");
		// var callback = wru.async(function(){...});
		googleTranslate("Hello, world!", {from: "en", to: "ru"}, wru.async(function (error, result, others) {
			wru.assert("Hello world translate (en -> ru)", result == "Привет, мир!");
			wru.assert(error, !error);
			// wru.assert("OK", "OK" === arg);
			// wru.assert(setup === 1);
			// wru.assert(teardown == null);
		}));
	}
});


wru.test(collection);