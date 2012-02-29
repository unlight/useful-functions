var self = module.exports;

module.exports.isArray = function isArray(a) {
	return (typeof(a) === "object") && (a instanceof Array);
}

module.exports.isBool = function isBool(mixed) {
	// Returns true if variable is a boolean
	return (typeof mixed === 'boolean');
}

module.exports.isNumeric = function isNumeric(mixed) {
	// Returns true if value is a number or a numeric string
	return (typeof(mixed) === 'number' || typeof(mixed) === 'string') && mixed !== '' && !isNaN(mixed);
}

module.exports.isString = function isString(mixed) {
	// Returns true if variable is a Unicode or binary string
	return (typeof mixed == 'string');
}

module.exports.ucfirst = function ucfirst(str) {
    // http://kevin.vanzonneveld.net
    // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   bugfixed by: Onno Marsman
    // +   improved by: Brett Zamir (http://brett-zamir.me)
    // *     example 1: ucfirst('kevin van zonneveld');
    // *     returns 1: 'Kevin van zonneveld'
    str += '';
    var f = str.charAt(0).toUpperCase();
    return f + str.substr(1);
}

module.exports.stringIsNullOrEmpty = function stringIsNullOrEmpty(s) {
	return (typeof s == 'undefined' || s === null || s === "");
}

module.exports.trim = function trim(str, charlist) {
	// http://kevin.vanzonneveld.net
	// +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	var whitespace, l = 0,
		i = 0;
	str += '';

	if (!charlist) {
		// default list
		whitespace = " \n\r\t\f\x0b\xa0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000";
	} else {
		// preg_quote custom list
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


module.exports.randomString = function randomString(Length, CharacterOptions) {
	if (typeof CharacterOptions != 'string') CharacterOptions = 'a0';
	var CharacterClasses = {
		'A': 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
		'a': 'abcdefghijklmnopqrstuvwxyz',
		'0': '0123456789',
		'!': '~!@#$^&*_+-'
	};
	var Characters = '';
	for (var i = 0; i < CharacterOptions.length; i++) {
		Characters += self.getValue(CharacterOptions.substr(i, 1), CharacterClasses);
	}
	var CharLen = Characters.length - 1;
	var string = '' ;
	for (var i = 0; i < Length; ++i) {
		var Offset = self.rand() % CharLen;
		string += Characters.substr(Offset, 1);
	}
	return string;
}

// Returns a random number
// http://kevin.vanzonneveld.net
// + original by: Onno Marsman
module.exports.rand = function rand(min, max) {
		if (arguments.length === 0) {
			min = 0;
			max = 2147483647;
		} else if (arguments.length === 1) {
			throw new Error('Warning: rand() expects exactly 2 parameters, 1 given.');
		}
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}
}


module.exports.getClassName = function getClassName(actor) {
	var result = ucfirst(typeof actor);
	if (actor && actor.constructor && typeof actor.constructor == 'object') {
		var functionCode = actor.constructor.toString();
		var pos = functionCode.indexOf('(');
		result = trim(functionCode.substr(8, pos-8));
	}
	return result;
}

/*
* Searches $data (and all arrays/objects it contains) for $value.
*/ 
module.exports.hasValue = function hasValue(data, value) {
	if (typeof data == 'object') {
		for (var k in data) {
			var v = data[k];
			if (typeof(v) == 'object' && hasValue(v, value)) return true;
			if (value == v) return true;
		}		
	}
	return false;
};


/**
* Set the value on an object/array.
*
* @param string $key The key or property name of the value.
* @param mixed $collection The array or object to set.
* @param mixed $value The value to set.
*/
module.exports.setValue = function(key, collection, value) {
	collection[key] = value;
};

/**
* Return the value from an associative array or an object.
*
* @param string $key The key or property name of the value.
* @param mixed $collection The array or object to search.
* @param mixed $value The value to return if the key does not exist.
* @param bool $remove Whether or not to remove the item from the collection.
* @return mixed The value from the array or object.
*/
module.exports.getValue = function(key, collection, value, remove) {
	if (typeof value == 'undefined') value = false;
	if (typeof remove == 'undefined') remove = false;
	var result = value;
	if (key in collection) result = collection[key];
	if (remove) delete collection[key];
	return result;
};

/**
* Set the value on an object/array if it doesn't already exist.
*
* @param string Key The key or property name of the value.
* @param mixed Collection The array or object to set.
* @param mixed Default The value to set.
*/
module.exports.touchValue = function touchValue(key, collection, value) {
	if (!(key in collection)) collection[key] = value;
	return self.getValue(key, collection);
}