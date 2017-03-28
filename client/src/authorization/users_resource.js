angular.module('twitter').factory('UsersResource',
  function($resource, endpoints) {
    var usersResourceDefaultParams = {
      id: '@id'
    };
    var usersResourceActions = {
      get: {
        method: 'GET',
        isArray: false,
        cache: false
      },
      query: {
        method: 'GET',
        isArray: false,
        cache: false
      },
      update: {
        method: 'PUT',
        isArray: false,
        cache: false
      },
      create: {
        method: 'POST',
        isArray: false,
        cache: false
      }
    };

    return $resource(endpoints.users.resourceUrl,
      usersResourceDefaultParams,
      usersResourceActions);
  });