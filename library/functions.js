var self = this;

self.isBoolean = function(object) {
	// Returns true if variable is a boolean
	return (typeof object === 'boolean');
}

self.isString = function(object) {
	// Returns true if variable is a Unicode or binary string
	return (typeof object == 'string');
}

self.trim = function(str, charlist) {
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

/**
 * Returns a random number.
 * @param  {[type]} min [description]
 * @param  {[type]} max [description]
 * @return {[type]}     [description]
 */
self.rand = function(min, max) {
	if (arguments.length === 0) {
		min = 0;
		max = 2147483647;
	} else if (arguments.length === 1) {
		throw new Error('Warning: rand() expects exactly 2 parameters, 1 given.');
	}
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

self.randomString = function(length, characterOptions) {
	if (typeof characterOptions != 'string') characterOptions = 'a0';
	var characterClasses = {
		'A': 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
		'a': 'abcdefghijklmnopqrstuvwxyz',
		'0': '0123456789',
		'!': '~!@#$^&*_+-'
	};
	var characters = '';
	for (var i = 0; i < characterOptions.length; i++) {
		characters += self.getValue(characterOptions.substr(i, 1), characterClasses);
	}
	var CharLen = characters.length - 1;
	var string = '' ;
	for (var i = 0; i < length; ++i) {
		var Offset = self.rand() % CharLen;
		string += characters.substr(Offset, 1);
	}
	return string;
}

/**
* Return a random number within the given range. 
* @param coerce mixed $min
* @param coerce float $max
* @return float $result.
*/ 
self.randRange = function(min, max) {
	var randomfloat = self.rand() / 2147483647;
	return min + (max - min) * randomfloat;
}

self.getValue = function(key, collection, value, remove) {
	if (typeof value == 'undefined') value = false;
	if (typeof remove == 'undefined') remove = false;
	var result = value;
	if (key in collection) result = collection[key];
	if (remove) delete collection[key];
	return result;
}


/**
* Set the value on an object/array if it doesn't already exist.
*
* @param string Key The key or property name of the value.
* @param mixed Collection The array or object to set.
* @param mixed Default The value to set.
*/
self.touchValue = function(key, collection, value) {
	if (!(key in collection)) collection[key] = value;
	return self.getValue(key, collection);
}

/**
* Return the value from an associative array or an object.
* This function differs from GetValue() in that $Key can be a string consisting of dot notation that will be used to recursivly traverse the collection.
*
* @param string $Key The key or property name of the value.
* @param mixed $Collection The array or object to search.
* @param mixed $Default The value to return if the key does not exist.
* @return mixed The value from the array or object.
*/
self.getValueR = function(key, collection, defaultResult) {
	if (typeof defaultResult == 'undefined') defaultResult = false;
	var path = key.split('.');
	var value = collection;
	var n = 0;
	var k;
	for (var i in collection) {
		var subkey = path[n++];
		if (k in value) value = value[subkey];
		else return defaultResult;
	}
	return value;
}

/**
* Returns the value associated with the $Needle key in the $Haystack
* associative array or FALSE if not found. This is a CASE-INSENSITIVE
* search.
*
* @param string The key to look for in the $Haystack associative array.
* @param array The associative array in which to search for the $Needle key.
* @param string The default value to return if the requested value is not found. Default is FALSE.
*/
self.getValueI = function(needle, haystack, defaultResult) {
	if (typeof defaultResult == 'undefined') defaultResult = false;
	var result = defaultResult;
	var lowerNeedle = needle.toLowerCase();
	if (typeof haystack == 'object') {
		for (var k in haystack) {
			if (lowerNeedle == k.toLowerCase()) {
				result = haystack[k];
				break;
			}
		}
	}
	return result;
}


/**
* Set the value on an object/array.
*
* @param string $key The key or property name of the value.
* @param mixed $collection The array or object to set.
* @param mixed $value The value to set.
*/
self.setValue = function(key, collection, value) {
	collection[key] = value;
}

/*
* Searches $data (and all arrays/objects it contains) for $value.
*/ 
self.hasValue = function(data, value) {
	if (typeof data == 'object') {
		for (var k in data) {
			var v = data[k];
			if (typeof(v) == 'object' && hasValue(v, value)) return true;
			if (value == v) return true;
		}		
	}
	return false;
}


self.stringIsNullOrEmpty = function(string) {
	return (typeof string == 'undefined' || string === null || string === "");
}