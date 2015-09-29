'use strict';

var debounce = require('mout/function/debounce');
var getClosest = require('domhelpers/getClosest');
var supportsTransition = require('./lib/supports')('transition');

/**
 * Create a new instance of disclose
 *
 * @param {Object} options
 * @param {String} options.anchor
 */
var Disclose = function(options){
	if (!(this instanceof Disclose)){
		return new Disclose(options);
	}

	options = options || {};
	options.anchor = options.anchor || 'topright';
	options.duration = 2000;
	this.options = options;

	this.grow = /top/.test(options.anchor) ? 'down' : 'up';

	this.heights = [];
	this.notifications = [];
};

/**
 * Build up wrap element
 */
Disclose.prototype._build = function(){
	if (this.wrap) return;

	var wrap = document.createElement('div');
	wrap.classList.add('disclose', 'disclose--pos-' + this.options.anchor);
	document.body.appendChild(wrap);

	var self = this;
	wrap.addEventListener('click', function(e){
		e.preventDefault();
		var btn = getClosest(e.target, '.disclose__act-close');
		if (!btn) return;

		var el = getClosest(btn, '.disclose__notification');
		var index = self.notifications.indexOf(el);
		self.clearOne(index);
	});

	this.wrap = wrap;
};

/**
 * Show a notification of a certain type
 *
 * @param {String} type
 * @param {String} message
 * @param {Object} options
 */
Disclose.prototype.notify = function(type, message, options){
	options = options || {};

	this._build();

	var self = this;
	var wrap = document.createElement('div');
	wrap.classList.add('disclose__notification', 'disclose--' + type);

	wrap.textContent = message;

	if (this.grow === 'up'){
		var offset = 0;
		for (var i = 0; i < this.heights.length; i++){
			offset += this.heights[i];
		}
		if (this.heights.length){
			offset += this.heights.length * 12;
		}
		wrap.style.bottom = offset + 'px';
	}

	if (!options.sticky){
		setTimeout(function(){
			var index = self.notifications.indexOf(wrap);
			self.clearOne(index);
		}, 2500);
	} else{
		var btn = document.createElement('button');
		btn.type = 'button';
		btn.classList.add('disclose__act-close');
		wrap.appendChild(btn);
		wrap.classList.add('disclose--sticky');
	}

	this.wrap.appendChild(wrap);

	var rect = wrap.getBoundingClientRect();
	this.heights.push(rect.bottom - rect.top);
	this.notifications.push(wrap);

	wrap.classList.add('disclose--shown');

	return this.notifications.length - 1;
};

/**
 * Clear a single notification by index
 *
 * @param {Number} index
 */
Disclose.prototype.clearOne = function(index){
	var el = this.notifications[index];
	if (!el) return;

	var self = this;

	if (supportsTransition){
		var transitionEvent = debounce(function(e){
			if (e.target !== el) return;

			el.removeEventListener('transitionend', transitionEvent);
			self.wrap.removeChild(el);
		}, 1);

		el.addEventListener('transitionend', transitionEvent);
		el.classList.remove('disclose--shown');
	} else{
		this.wrap.removeChild(el);
	}

	this.heights.splice(index, 1);
	this.notifications.splice(index, 1);
	this.reposition();
};

/**
 * Reposition all active notifications
 */
Disclose.prototype.reposition = function(){
	var el;
	var offset = 0;
	for (var i = 0; i < this.notifications.length; i++){
		el = this.notifications[i];
		if (i > 0){
			offset += this.heights[i - 1] + 12;
		}
		if (this.grow === 'up'){
			el.style.bottom = offset + 'px';
		}
	}
};

[ 'success', 'info', 'error', 'warning' ].forEach(function(type){
	/**
	 * Show a notification of a specific type
	 *
	 * @param {String} message
	 * @param {Object} options
	 */
	Disclose.prototype[type] = function(message, options){
		return this.notify(type, message, options);
	};
});

module.exports = Disclose;
