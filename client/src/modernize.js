/*
* Conditional polyfills
* Author: Ahmed H. Ismail
*/
(function() {
  if (!Modernizr.flexbox) {
    $.getScript('polyfills/flexie.js');
  }

  if (!Modernizr.input.required) {
    $.getScript('polyfills/jquery.h5validate.js').done (function () {
      $(document).ready (function() {
        $('form').h5Validate();
      });
    });
  }

  if (!(Modernizr.input.placeholder && Modernizr.input.autofocus)) {
    $.getScript('polyfills/jquery.html5support.js').done(function(){
      $(document).ready(function() {
        if (!Modernizr.input.placeholder) {
          $.placeholder();
        }
        if (!Modernizr.input.autofocus) {
          $.autofocus();
        }
      });
    });

  }


  if (!(Modernizr.csstransforms && Modernizr.csstransforms3d)) {
    $.getScript('polyfills/transform/sylvester.js').done(function() {
      $.getScript('polyfills/transform/transformie.js');
    });
  }

  if (!Modernizr.testProp('pointerEvents')){
    $.getScript('polyfills/pointer_events_polyfill.js').done(function() {
      $(document).ready(function(){
        PointerEventsPolyfill.initialize({});
      });
    });
  }

}).call(this);

