(function($) {$.extend({ahover: {version: 1.0,defaults: {toggleSpeed: 75,toggleEffect: 'both',hoverEffect: null,moveSpeed: 250,easing: 'swing',className: 'ahover'},effects: {'width': {width: 0},'height': {height: 0},'both': {width: 0, height: 0}}}});$.fn.extend({ahover: function(options) {var options = $.extend({}, $.ahover.defaults, options);var effect = ((typeof options.toggleEffect == 'string') ?$.ahover.effects[options.toggleEffect] : options.toggleEffect);var parent = this.offsetParent();return this.hover(function(e) {var over = $(this);var overSize = {width: over.outerWidth(),height: over.outerHeight()};var overOffset = over.offset();var parentOffset = parent.offset();var under = $('div.' + options.className, parent).stop();var created = (under.length == 0);if (created) {under = $('<div>&nbsp;</div>').addClass(options.className).appendTo(parent).css(overSize);}var underOffset = {left: overOffset.left - parentOffset.left -(under.outerWidth() - under.width()) / 2,top: overOffset.top - parentOffset.top -(under.outerHeight() - under.height()) / 2};if (created) {under.css(underOffset).css(effect).animate(overSize, {queue: false,duration: options.toggleSpeed,easing: options.easing});}else {var underCSS = $.extend({}, overSize, underOffset);under.animate(underCSS, {queue: false,duration: options.moveSpeed,easing: options.easing});}if ($.isFunction(options.hoverEffect)) {under.queue(options.hoverEffect);}},function(e) {$('div.' + options.className, parent).animate(effect, {queue: false,duration: options.toggleSpeed,easing: options.easing,complete: function() { $(this).remove(); }});});}});})(jQuery);
/*
     FILE ARCHIVED ON 16:51:24 Apr 28, 2012 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 13:49:03 Sep 25, 2018.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  LoadShardBlock: 99.224 (3)
  esindex: 0.014
  captures_list: 115.857
  CDXLines.iter: 12.277 (3)
  PetaboxLoader3.datanode: 111.582 (4)
  exclusion.robots: 0.214
  exclusion.robots.policy: 0.199
  RedisCDXSource: 0.617
  PetaboxLoader3.resolve: 618.598
  load_resource: 648.792
*/