angular.module('twitter').config(function($authProvider, apiHost) {
  $authProvider.tokenPrefix = 'twitter_v1';
  $authProvider.httpInterceptor = true;
  $authProvider.storage = 'localStorage';
  $authProvider.baseUrl = apiHost;
  $authProvider.loginUrl = 'tokens';
  $authProvider.signupUrl = 'profiles';
});


/*
* Logout users with invalid tokens
* Author: Ahmed H. Ismail
*/
angular.module('twitter').run(function($rootScope, $state, UserAuth) {
  return $rootScope.$on('unauthorizedResponse', function() {
    if (UserAuth.signedIn){
      UserAuth.logout();
      return $state.go('public.login');
    }
  });
});


/*
* HTTP Interceptor for 401s (expired tokens)
* Author: Ahmed H. Ismail
*/
angular.module('twitter').config(function($httpProvider) {
  return $httpProvider.interceptors.push(function($q, $rootScope) {
    return {
      responseError: function(response) {
        if (response.status === 401) {
          $rootScope.$emit('unauthorizedResponse');
          return $q.reject(response);
        } else {
          return $q.reject(response);
        }
      }
    };
  });
});



/*
* Authorization checks for state auth data
* States must provide an authRule method in their data object
* authRule is called with one paramater which is UserAuth
* it is expected to return an object, referred to as authStatus, that must have at least one property
* that is allowed, if true the transition continues.
* Else the transition is interrupted and instead a transition is started
* to the state authStatus.to with the params authStatus.parms.
* params are optional.
* The original state and its params are queued in the redirect service.
* if and only if authStatus.redirectBack is set to true
* Author: Ahmed H. Ismail
*/
angular.module('twitter').run(function($rootScope, $state, UserAuth, redirect) {
  $rootScope.$on('$stateChangeStart', function(e, toState, toParams) {
    if (angular.isUndefined(toState.data)) {
      // Does not provide a data object
      return;
    }
    if (!angular.isFunction(toState.data.authRule)) {
      // authRule does not exist or is not a function
      return;
    }
    var authStatus = toState.data.authRule(UserAuth);
    if (!authStatus.allowed) {
      if (authStatus.redirectBack) {
        redirect.push({
          state: toState,
          params: toParams
        });
      }
      e.preventDefault();
      $state.go(authStatus.to, authStatus.params);
    }
  });
});