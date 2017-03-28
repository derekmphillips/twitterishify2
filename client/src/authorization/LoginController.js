angular.module('twitter').controller('LoginController', function ($scope, $state, UserAuth, redirect) {
  $scope.loginData = {
    remember: true
  };
  $scope.processing = false;
  $scope.error = undefined;

  $scope.login = function () {
    if ($scope.processing) {
      return;
    }
    $scope.processing = true;
    if ($scope.loginData.remember) {
      $scope.loginData.expiration = undefined;
    } else {
      $scope.loginData.expiration = 60 * 60 * 24;
    }
    UserAuth.login($scope.loginData).then(function (user) {
      if (redirect.empty) {
        $state.go(user.defaultStateName);
      } else {
        var destination = redirect.pop();
        $state.go(destination.state, destination.params);
      }
    }).catch(function (response) {
      $scope.processing = false;
      switch (response.status) {
        case 401:
          $scope.error = 'Invalid Credentials';
          break;
        case 403:
          $scope.error = 'Invalid Credentials';
          break;
        default:
          $scope.error = 'Server Error';
      }
    });
  }
});