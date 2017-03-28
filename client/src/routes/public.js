angular.module('twitter').config(function ($stateProvider) {
  var redirectIfSignedInAuthRule = function (userAuth) {
    // redirect if signed in
    if (userAuth.signedIn) {
      return {
        to: 'base.private.tweets',
        params: {},
        allowed: false,
        redirectBack: false
      };
    } else {
      return {
        allowed: true
      };
    }
  };

  var baseState = {
    name: 'base',
    abstract: true,
    views: {
      '@': {
        templateUrl: 'views/parent_templates/base.html'
      }
    }
  };

  var loginState = {
    name: 'base.login',
    url: '/login',
    views: {
      'main-content': {
        templateUrl: 'authorization/views/login.html'
      }
    },
    data: {
      authRule: redirectIfSignedInAuthRule
    },
    resolve: {
      $title: function () {
        return 'Login';
      }
    }
  };

  var landingPageState = {
    name: 'base.landing',
    url: '',
    views: {
      'main-content': {
        templateUrl: 'views/static/landing.html'
      }
    }
  };

  var registerState = {
    name: 'base.register',
    url: '/register',
    views: {
      'main-content': {
        templateUrl: 'authorization/views/register.html'
      }
    },
    data: {
      authRule: redirectIfSignedInAuthRule
    },
    resolve: {
      $title: function () {
        return 'Register';
      }
    }
  };

  $stateProvider
    .state(baseState)
    .state(loginState)
    .state(landingPageState)
    .state(registerState);

});