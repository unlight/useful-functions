var p = Object.prototype;
var toString = Object.prototype.toString;

if (!p.getClassName) {
	p.getClassName = function() {
		var object = this;
		var string = toString.call(object).split(' ')[1];
		var result = string.substr(0, string.length - 1);
		return result;
	}
}

if (!p.isNumeric) {
	p.isNumeric = function() {
		var result = !isNaN(parseFloat(this)) && isFinite(this);
		return result;
	}
}

if (!p.isArray) {
	/**
	 * Returns true if object is an array.
	 * @return Boolean
	 */
	p.isArray = function() {
		var result = (this instanceof Array);
		return result;
	}
}