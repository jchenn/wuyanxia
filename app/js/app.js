angular.module('wuyanxia', ['ionic','house','people', 'me'])

.run(function($rootScope, $location, $ionicPlatform) {
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

  // 根据 hash 在主内容区域显示页面
  // @param hash 前面以斜杠开始，如 '/menu/me' 会跳转到 #/menu/me 对应的页面
  $rootScope.go = function(hash) {
    // console.log(hash);
    $location.path(hash);
  };
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
