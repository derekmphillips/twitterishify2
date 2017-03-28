/*
* Better than ngCloak since .hidden is applied by the browser before
* angular is loaded, while rendering the dom.
* Author: Ahmed H. Ismail
*/
angular.module('twitter').directive('removeHidden', function() {
  return {
    restrict: 'A',
    priority: 1,
    link: function(scope, element) {
      element.removeClass('hidden');
    }
  };
});