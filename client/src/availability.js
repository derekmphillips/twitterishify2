// Directive to check if a value like username/email is already taken
angular.module('twitter').directive('checkAvailability', function($http, $q, endpoints) {
    var directive = {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, ele, attrs, ctrl) {
            var endpointPath = attrs.checkAvailabilityEndpoint.split(':');
            var endpoint = endpoints;
            endpointPath.forEach(function(key) {
                endpoint = endpoint[key];
            });
            ctrl.$asyncValidators.checkAvailability = function(modelValue, viewValue) {
                return $http.get(endpoint,
                  {
                    cache: false,
                    params: {
                      value: viewValue.trim()
                    }
                  }).then(function(response) {
                  if (response.data.count !== 0) {
                    return $q.reject(response.data.count);
                  } else {
                    return true;
                  }
                });
              };
        }
    };
    return directive;
});