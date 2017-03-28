angular.module('twitter').controller('SignupController', function ($scope, UserAuth, $state) {
  $scope.profile = {};
  $scope.processing = false;
  $scope.signup = function () {
    if ($scope.processing) {
      return;
    }
    $scope.processing = true;
    UserAuth.signup($scope.profile).then(function () {
      $scope.processing = false;
      $state.go('base.private.tweets');
    });
  };
});