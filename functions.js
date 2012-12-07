var ServerResponse = require('http').ServerResponse;
var ServerRequest = require('http').IncomingMessage;
var fs = require('fs');
var utilLog = require('util').log; 
var isArray = require('util').isArray;
var inspect = require('util').inspect;
var format = require('util').format;
var toString = Object.prototype.toString;
var self = {};
module.exports = self;

function getServerResponse() {
	arguments[-1] = global["_RESPONSE"];
	for (var i = -1, length = arguments.length; i < length; i++) {
		var object = arguments[i];
		if (object instanceof ServerResponse) {
			return object;
		}
	}
}

function getServerRequest() {
	arguments[-1] = global["_REQUEST"]
	for (var i = -1, length = arguments.length; i < length; i++) {
		var object = arguments[i];
		if (object instanceof ServerRequest) {
			return object;
		}
	}
}

self.connectFunctions = function() {
	return function(request, response, next) {
		global["_REQUEST"] = request;
		global["_RESPONSE"] = response;
		next();
	};
}

self.cleanUpString = (function() {
	var latins = {'-':' ', '_':' ', '&lt;':'', '&gt;':'', '&#039;':'', '&amp;':'','&quot;':'', 'À':'A', 'Á':'A', 'Â':'A', 'Ã':'A', 'Ä':'Ae','&Auml;':'A', 'Å':'A', 'Ā':'A', 'Ą':'A', 'Ă':'A', 'Æ':'Ae','Ç':'C', 'Ć':'C', 'Č':'C', 'Ĉ':'C', 'Ċ':'C', 'Ď':'D', 'Đ':'D','Ð':'D', 'È':'E', 'É':'E', 'Ê':'E', 'Ë':'E', 'Ē':'E','Ę':'E', 'Ě':'E', 'Ĕ':'E', 'Ė':'E', 'Ĝ':'G', 'Ğ':'G','Ġ':'G', 'Ģ':'G', 'Ĥ':'H', 'Ħ':'H', 'Ì':'I', 'Í':'I','Î':'I', 'Ï':'I', 'Ī':'I', 'Ĩ':'I', 'Ĭ':'I', 'Į':'I','İ':'I', 'Ĳ':'IJ', 'Ĵ':'J', 'Ķ':'K','Ł':'K', 'Ľ':'K','Ĺ':'K', 'Ļ':'K', 'Ŀ':'K', 'Ñ':'N', 'Ń':'N', 'Ň':'N','Ņ':'N', 'Ŋ':'N', 'Ò':'O', 'Ó':'O', 'Ô':'O', 'Õ':'O','Ö':'Oe', '&Ouml;':'Oe', 'Ø':'O', 'Ō':'O', 'Ő':'O', 'Ŏ':'O','Œ':'OE', 'Ŕ':'R', 'Ř':'R', 'Ŗ':'R', 'Ś':'S', 'Š':'S','Ş':'S', 'Ŝ':'S', 'Ș':'S', 'Ť':'T', 'Ţ':'T', 'Ŧ':'T','Ț':'T', 'Ù':'U', 'Ú':'U', 'Û':'U', 'Ü':'Ue', 'Ū':'U','&Uuml;':'Ue', 'Ů':'U', 'Ű':'U', 'Ŭ':'U', 'Ũ':'U', 'Ų':'U','Ŵ':'W', 'Ý':'Y', 'Ŷ':'Y', 'Ÿ':'Y', 'Ź':'Z', 'Ž':'Z','Ż':'Z', 'Þ':'T', 'à':'a', 'á':'a', 'â':'a', 'ã':'a','ä':'ae', '&auml;':'ae', 'å':'a', 'ā':'a', 'ą':'a', 'ă':'a','æ':'ae', 'ç':'c', 'ć':'c', 'č':'c', 'ĉ':'c', 'ċ':'c','ď':'d', 'đ':'d', 'ð':'d', 'è':'e', 'é':'e', 'ê':'e','ë':'e', 'ē':'e', 'ę':'e', 'ě':'e', 'ĕ':'e', 'ė':'e','ƒ':'f', 'ĝ':'g', 'ğ':'g', 'ġ':'g', 'ģ':'g', 'ĥ':'h','ħ':'h', 'ì':'i', 'í':'i', 'î':'i', 'ï':'i', 'ī':'i','ĩ':'i', 'ĭ':'i', 'į':'i', 'ı':'i', 'ĳ':'ij', 'ĵ':'j','ķ':'k', 'ĸ':'k', 'ł':'l', 'ľ':'l', 'ĺ':'l', 'ļ':'l','ŀ':'l', 'ñ':'n', 'ń':'n', 'ň':'n', 'ņ':'n', 'ŉ':'n','ŋ':'n', 'ò':'o', 'ó':'o', 'ô':'o', 'õ':'o', 'ö':'oe','&ouml;':'oe', 'ø':'o', 'ō':'o', 'ő':'o', 'ŏ':'o', 'œ':'oe','ŕ':'r', 'ř':'r', 'ŗ':'r', 'š':'s', 'ù':'u', 'ú':'u','û':'u', 'ü':'ue', 'ū':'u', '&uuml;':'ue', 'ů':'u', 'ű':'u','ŭ':'u', 'ũ':'u', 'ų':'u', 'ŵ':'w', 'ý':'y', 'ÿ':'y','ŷ':'y', 'ž':'z', 'ż':'z', 'ź':'z', 'þ':'t', 'ß':'ss','ſ':'ss', 'ый':'iy', 'А':'A', 'Б':'B', 'В':'V', 'Г':'G','Д':'D', 'Е':'E', 'Ё':'YO', 'Ж':'ZH', 'З':'Z', 'И':'I','Й':'Y', 'К':'K', 'Л':'L', 'М':'M', 'Н':'N', 'О':'O','П':'P', 'Р':'R', 'С':'S', 'Т':'T', 'У':'U', 'Ф':'F','Х':'H', 'Ц':'C', 'Ч':'CH', 'Ш':'SH', 'Щ':'SCH', 'Ъ':'','Ы':'Y', 'Ь':'', 'Э':'E', 'Ю':'YU', 'Я':'YA', 'а':'a','б':'b', 'в':'v', 'г':'g', 'д':'d', 'е':'e', 'ё':'yo','ж':'zh', 'з':'z', 'и':'i', 'й':'y', 'к':'k', 'л':'l','м':'m', 'н':'n', 'о':'o', 'п':'p', 'р':'r', 'с':'s','т':'t', 'у':'u', 'ф':'f', 'х':'h', 'ц':'c', 'ч':'ch','ш':'sh', 'щ':'sch', 'ъ':'', 'ы':'y', 'ь':'', 'э':'e','ю':'yu', 'я':'ya'};
	var regexp = new RegExp("(" + Object.keys(latins).join("|") + ")", "g");
	return function(string) {
		string = string.replace(regexp, function(oldChar) {
			var newChar = latins[oldChar];
			return newChar;
		});
		string = string.replace(/[^A-Za-z0-9 ]/g, "");
		string = self.trim(string);
		string = string.replace(/ +/g, "-");
		return string.toLowerCase();
	};
})();

self.googleTranslate = function(string, settings, callback) {
	if (!settings) settings = {};
	if (!callback) callback = settings.callback;
	var from = settings.from || "ru";
	var to = settings.to || "en";

	var http = require('http');
	var querystring = require('querystring');

	// string = encodeURIComponent(string);

	var data = {
		client: "t",
		text: string,
		sl: from,
		tl: to,
		ie: "UTF-8",
		oe: "UTF-8"
	};

	var options = {
		host: "translate.google.com",
		port: 80,
		method: "GET",
		headers: {
			"Referer": "http://translate.google.com/"
		},
		path: "/translate_a/t?" + querystring.stringify(data)
	};

	var body = "";

	var request = http.request(options, function(response) {
		response.setEncoding("utf8");
		response.on("data", function(chunk) {
			body += chunk.toString("utf8");
		});
		response.on("end", function() {
			var pos = body.indexOf("]]");
			body = body.substr(1, pos + 1);
			try {
				var json = JSON.parse(body);	
			} catch (e) {
				var error = new Error(["JSON parse", e.name, e.message].join(", ") + ".");
				if (callback) callback(error, false);
				return;
			}
			var all = self.getValue(0, json);
			var result = self.getValue(0, all);
			// result = html_entity_decode(result, ent_quotes, 'utf-8');
			if (callback) callback(false, result, all);
		});
	});

	request.on("error", function(e) {
		if (callback) callback(e, false);
	});

	request.end();
	
}

self.getIpAddress = function() {
	var result;
	var request = getServerRequest(arguments[0], this);
	if (request) {
		result = request.connection.remoteAddress
	}
	return result;
}

function inArray(needle, haystack) {
	var someTest = function(value) {
		return (value == needle);
	};
	return (isArray(haystack) && haystack.some(someTest));
}

function escapeHtml(string) {
	string = string
		.replace('&', '&amp;')
		.replace('<', '&lt;')
		.replace('>', '&gt;')
		.replace('"', '&#34;')
		.replace('\'', '&#39;');
	return string;
}

function insideCut(string, length, separator) {
	if (string.length > length) {
		if (separator == undefined) separator = '...';
		//if (separator == undefined) separator = '…';
		var padding = Math.floor(length/2);
		string = string.slice(0, padding) + separator + string.slice(-padding);
	}
	return string;	
}

self.ucfirst = function(string) {
	string += '';
	var first = string.charAt(0).toUpperCase();
	return first + string.substr(1);
}

self.getExtension = function(string) {
	string += '';
	return string.substr(string.lastIndexOf('.') + 1);
}

function getClassName(object) {
	var result;
	if (object && object.constructor && typeof object.constructor == 'function') {
		var functionCode = object.constructor.toString();
		var pos = functionCode.indexOf('(');
		result = self.trim(functionCode.substr(8, pos-8));
	} else {
		result = toString.call(object).slice(8, -1);
	}
	return result;
}

self.clamp = function(v, a, b) {
	if (v > b) return b;
	else if (v < a) return a;
	else return v;
}

self.isNumeric = function(mixed) {
	var result = !isNaN(parseFloat(mixed)) && isFinite(mixed);
	return result;
}

self.isString = function(object) {
	// Returns true if variable is a Unicode or binary string.
	return (typeof object == 'string');
}

self.trim = function(str, charlist) {
	// http://kevin.vanzonneveld.net
	var whitespace, l = 0,
		i = 0;
	str += '';

	if (!charlist) {
		whitespace = " \n\r\t\f\x0b\xa0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000";
	} else {
		charlist += '';
		whitespace = charlist.replace(/([\[\]\(\)\.\?\/\*\{\}\+\$\^\:])/g, '$1');
	}

	l = str.length;
	for (i = 0; i < l; i++) {
		if (whitespace.indexOf(str.charAt(i)) === -1) {
			str = str.substring(i);
			break;
		}
	}

	l = str.length;
	for (i = l - 1; i >= 0; i--) {
		if (whitespace.indexOf(str.charAt(i)) === -1) {
			str = str.substring(0, i + 1);
			break;
		}
	}

	return whitespace.indexOf(str.charAt(0)) === -1 ? str : '';
}

self.safeGlob = function(pattern, extensions, callback) {
	// TODO: extensions
	// TODO: callback
	var dirname = require('path').dirname;
	var basename = require('path').basename;
	var chars = basename(pattern).split('');
	var regexpString = '';
	for (var i = 0, length = chars.length; i < length; i++) {
		var symbol = chars[i];
		switch (symbol) {
			case '.': regexpString += '\\' + symbol; break;
			case '*': regexpString += '.*'; break;
			default: regexpString += symbol;
		}
	}
	var regexp = new RegExp(regexpString);
	var directory = dirname(pattern);
	// TODO: Async
	var files = fs.readdirSync(directory);
	var result = [];
	files.forEach(function(name) {
		if (regexp.test(name)) {
			result.push(directory + '/' + name);
		}
	});
	return result;
}

self.stringBeginsWith = function(haystack, needle) {
	if (haystack == null) haystack = '';
	var result = haystack.substr(0, needle.length) == needle;
	return result;
}

self.getValue = function(key, collection, value, remove) {
	if (value === undefined) value = false;
	if (remove === undefined) remove = false;
	var result = value;
	if (typeof collection == 'object' && key in collection) {
		result = collection[key];
	}
	if (remove) {
		delete collection[key];
	}
	return result;
}

self.getValueR = function(key, collection, defaultResult) {
	if (defaultResult == undefined) defaultResult = false;
	var path = key.split('.');
	var value = collection;
	for (var i = 0, length = path.length; i < length; i++) {
		var subkey = path[i];
		if (subkey in value) {
			value = value[subkey];
		} else {
			return defaultResult;
		}
	}
	console.log("value", value);
	return value;
}

self.hasValue = function(data, value) {
	if (typeof data == 'object') {
		for (var k in data) {
			var v = data[k];
			if (typeof(v) == 'object' && self.hasValue(v, value)) return true;
			if (value == v) return true;
		}		
	}
	return false;
}

self.formatSize = (function() {
	var units = ['B', 'K', 'M', 'G', 'T'];
	var log1024 = Math.log(1024);
	
	return function(bytes, precision) {
		if (arguments.length < 2) precision = 2;
		var pow = Math.floor(Math.log(bytes) / log1024);
		pow = Math.min(pow, units.length - 1);
		bytes /= Math.pow(1024, pow);
		return bytes.toFixed(precision).toString() + units[pow];
	};
})();

self.log = function(message) {
	var args = Array.prototype.slice.call(arguments, 1);
	message = format.apply(this, [message].concat(args));
	utilLog(message);
}

self.htmlspecialchars = function(string) {
	// TODO: Implement me.
	return self.escapeHtml(string);
}

self.throwErrorMessage = function(message, senderObject, senderMethod, code) {
	var string = [message, senderObject, senderMethod, code].join(' '); // <-- &nbsp; ALT+0160
	throw new Error(string);
}

/**
 * [exceptionHandler description]
 * @param  {[type]} error [description]
 * @return {[type]}       [description]
 * process.on('uncaughtException', exceptionHandler);
 */
function exceptionHandler(error) {
	if (typeof error == "string") error = new Error(error);
	var messageInfo = error.message.split(' ');
	var message = error.message;
	var senderObject;
	var senderMethod;
	var senderCode;
	var backtraceCodeStack = 1;
	if (messageInfo.length == 4) {
		message = messageInfo[0];
		senderObject = messageInfo[1];
		senderMethod = messageInfo[2];
		senderCode = messageInfo[3];
		backtraceCodeStack = 2;
	} else {
		message = insideCut(message, 80);
	}
	var stack = error.stack;
	var stackArray = stack.split("\n    at ");
	var filePath;
	var lineNumber;
	var errorLines;
	var filePathFound = false;
	var backtrace = [];
	for (var i = 1, length = stackArray.length; i < length; i++) {
		var line = stackArray[i];
		if (!filePathFound && i >= backtraceCodeStack) {
			var match = line.match(/\((.+?):(\d+):\d+\)$/);
			if (match) {
				filePath = match[1];
				lineNumber = parseInt(match[2], 10);
				if (fs.existsSync(filePath)) {
					filePathFound = true;
					errorLines = fs.readFileSync(filePath, 'utf8').split("\n");
				}
			}
		}
		backtrace.push(line);
	}
	if (!senderObject && !senderMethod) {
		var sender = backtrace[0].split(' ')[0].split('.');
		if (sender.length > 0) {
			senderMethod = sender.pop();
		}
		if (sender.length > 0) {
			senderObject = sender.shift();
		}
		// TODO: TRY TO FIND MORE EFFECTIVE 
		if (!senderObject) {
			senderObject = 'Javascript';
		}
		if (!senderMethod) {
			senderMethod = 'exceptionHandler';
		}
	}

	var panicError = true;
	var deliveryType = 'ALL'; // TODO: DETECT 'deliveryType'
	
	var os = require('os');

	var errorCodeTrace = '';
	if (isArray(errorLines) && lineNumber > -1) {
		var errorCodeLines = errorLines.slice(lineNumber - 6, lineNumber + 4);
		for (var i = 0, length = errorCodeLines.length, last = length - 1; i < length; i++) {
			var fileLineNumber = lineNumber - 6 + i + 1;
			var padding = '>';
			var cssClass = '';
			if (fileLineNumber == lineNumber) {
				padding += '>>';
				cssClass = 'Highlight';
			}
			padding = padding + '   ';
			padding = padding.slice(0, 3) + ' ' + fileLineNumber + ':';
			var line = (padding + ' ' + escapeHtml(errorCodeLines[i])).trim();
			if (i != last) {
				line += "\n";
			}
			errorCodeTrace += '<span' + (cssClass ? ' class="'+cssClass+'"' : '') + '>' + line + '</span>';
		}
		errorCodeTrace = '<pre>' + errorCodeTrace + '</pre>';
	}

	var versions = process.versions;

	if (panicError == true) {
		if (deliveryType == 'ALL') {
			var deverrorCssFile = __dirname + '/design/deverror.css';
			var styleCss = fs.readFileSync(deverrorCssFile);
			if (styleCss) {
				styleCss = ['<style type="text/css">', styleCss, '</style>'].join("\n");
			}
			var html = [
				'<!DOCTYPE html>',
				'<html>',
				'<head>',
				'<meta name="robots" content="noindex" />',
				'<title>' + 'Fatal Error' + '</title>',
				styleCss ? styleCss : '',
				// '<link href="/applications/garden/design/deverror.css" type="text/css" rel="stylesheet">',
				'</head>',
				'<body>',
				'<div id="Frame">',
				'<h1>' + 'Fatal Error in ' + senderObject + '.' + senderMethod + '()' + '</h1>',
				'<div id="Content">',
				'<h2>' + escapeHtml(message) + '</h2>',
				(senderCode) ? '<code>' + escapeHtml(senderCode) + '</code>' : '',
				(filePath) ? '<h3>The error occurred on or near: <strong> ' + filePath + '</strong></h3>' : '',
				(errorCodeTrace) ? '<div class="PreContainer">' + errorCodeTrace + '</div>' : '',
				'<h3><strong>Backtrace:</strong></h3>',
				// TODO: escapeHtml on backtrace
				'<div class="PreContainer"><pre>' + backtrace.join("\n") + '</pre></div>',
				//'<h3><strong>Variables in local scope:</strong></h3>',
				//'<h3><strong>Queries:</strong></h3>',
				//'<h3>Need Help?</h3>',
				//'<p>If you are a user of this website, you can report this message to a website administrator.</p>',
				//'<p>If you are a user of this website, you can report this message to a website administrator.</p>',
				'<h3><strong>Additional information:</strong></h3>',
				'<ul>',
				'<li><strong>Error:</strong> ' + escapeHtml(message) + '</li>',
				// '<li><strong>Application:</strong> ' + '' + '</li>',
				// '<li><strong>Application Version:</strong> ' + '' + '</li>',
				'<li><strong>Operating System:</strong> ' + [os.platform(), os.release()].join(' ') + '</li>',
				'<li><strong>Server Software:</strong> ' + ['node', versions.node, 'v8', versions.v8].join(' ') + '</li>',
				// TODO: ADD BELOW
				//'<li><strong>User Agent:</strong> ' + '?' + '</li>',
				//'<li><strong>Request Uri:</strong> ' + '?' + '</li>',
				'</ul>',
				'</div>',
				'</div>',
				'</body>',
				'</html>',
			].join("\n");
			var response = getServerResponse();
			if (response) {
				response.statusCode = 500;
				response.write(html);
				response.end();
			}
			var errorText = error.stack;
			console.error(errorText);

		} else {
			throw new Error("Not implemented.");
		}
	} else {
		throw new Error("Not implemented.");
	}

}

function d() {
	var args = Array.prototype.slice.call(arguments);
	var response;
	// Search ServerResponse object.
	for (var i = 0; i < args.length; i++) {
		var arg = args[i];
		if (typeof arg == "object" && arg instanceof ServerResponse) {
			response = args.splice(i, 1)[0];
			break;
		}
	}
	if (!response) {
		response = getServerResponse();
	}
	for (var i = 0; i < args.length; i++) {
		var h = new Array(i + 2).join('*');
		var arg = args[i];
		//var arg = inspect(args[i], true, 1);
		console.log(h, arg);
	}

	if (response) {
		if (!response._headerSent) {
			//response.setHeader('Content-Type', 'plain/text; charset=utf-8');
			response.setHeader('Content-Type', 'text/html; charset=utf-8');
		}
		response.write("<pre>");
		for (var i = 0; i < args.length; i++) {
			response.write(new Array(i + 2).join('*'));
			response.write("\n");
			response.write(inspect(args[i], true, 1));
			response.write("\n");
		}
		response.write("</pre>");
		response.end();
	}
}

module.exports.d = d;
module.exports.inArray = inArray;
module.exports.isArray = isArray;
module.exports.insideCut = insideCut;
module.exports.exceptionHandler = exceptionHandler;
module.exports.getClassName = getClassName;

if (typeof global["d"] == "undefined") global["d"] = d;