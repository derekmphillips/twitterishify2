angular.module('twitter').controller('NavController', function($scope, UserAuth, $state) {
    $scope.isLoggedIn = function() {
        return UserAuth.signedIn;
    };
    
    $scope.signout = function() {
        UserAuth.logout();
        $state.go('base.login');
    };
});