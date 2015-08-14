'use strict';

var div = document.createElement('div');
var vendors = 'Khtml Ms O Moz Webkit'.split(' ');
var len = vendors.length;

/**
 * Check if browser supports given property
 *
 * @param {String} prop
 * @return {Boolean|String}
 */
module.exports = function(prop){
	if (prop in div.style) return true;

	prop = prop.replace(/^[a-z]/, function(val){
		return val.toUpperCase();
	});

	while (len--){
		if (vendors[len] + prop in div.style){
			return true;
		}
	}

	return false;
};
