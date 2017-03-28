angular.module('twitter').config(function ($urlMatcherFactoryProvider) {
  $urlMatcherFactoryProvider.strictMode(false);
});

angular.module('twitter').config(function (localStorageServiceProvider) {
  localStorageServiceProvider.setPrefix('twitter');
  localStorageServiceProvider.setStorageCookie(300, '/', true);
});

angular.module('twitter').config(function ($mdIconProvider) {
  $mdIconProvider.fontSet('md', 'material-icons');
});

angular.module('twitter').config(function ($mdThemingProvider) {
  $mdThemingProvider
    .theme('default')
    .primaryPalette('blue')
    .accentPalette('pink')
    .warnPalette('deep-orange')
    .backgroundPalette('grey');
});


angular.module('twitter').config(function($compileProvider) {
    $compileProvider.debugInfoEnabled(false);
});
