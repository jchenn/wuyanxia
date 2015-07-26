angular.module('wuyanxia', ['ionic', 'house','wuww','people'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }

    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleLightContent();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

  $stateProvider
    .state('menu', {
      abstract: true,
      url: '/menu',
      templateUrl: 'templates/menu.html'
    });

  // 暂时默认到室友列表
  $urlRouterProvider.otherwise('/menu/people-list');

  // 强制让标签栏在底部
  // $ionicConfigProvider.tabs.position('bottom');

  // 去除标题栏返回按钮的文字
  $ionicConfigProvider.backButton.text('').previousTitleText(false);
});
