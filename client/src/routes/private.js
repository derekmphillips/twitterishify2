angular.module('twitter').config(function ($stateProvider) {
  var redirectIfnotSignedIn = function (userAuth) {
    // redirect if not signed in
    if (!userAuth.signedIn) {
      return {
        to: 'base.login',
        params: {},
        allowed: false,
        redirectBack: true
      };
    } else {
      return {
        allowed: true
      };
    }
  };

  var privateState = {
    name: 'base.private',
    abstract: true,
    data: {
      authRule: redirectIfnotSignedIn
    }
  };
  var tweetsState = {
    resolve: {
      $title: function () {
        return 'Tweets';
      }
    },
    views: {
      'main-content@base': {
        templateUrl: 'tweets/search.html'
      }
    },
    name: 'base.private.tweets',
    url: '/tweets'
  };

  var profileState = {
    resolve: {
      $title: function() {
        return 'Profile';
      }
    },
    views: {
      'main-content@base': {
        templateUrl: 'users/profile.html'
      }
    },
    name: 'base.private.profile',
    url: '/profile'
  };

  $stateProvider
    .state(privateState)
    .state(tweetsState)
    .state(profileState)
    ;
});