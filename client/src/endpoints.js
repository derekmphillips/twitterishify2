angular.module('twitter').factory('endpoints', function(apiHost) {
  var endpoints = {
    users: {
      resourceUrl: [apiHost, 'users', ':id'].join('/'),
      email_count: [apiHost, 'users', 'email', 'exists'].join('/'),
    }
  };

  return endpoints;
});