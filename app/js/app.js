angular.module('wuyanxia', ['ionic', 'menu', 'house', 'people', 'me', 'auth', 'global.service'])

.run(function($rootScope, $location, $ionicPlatform, PersonalInfo) {
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
  
  // 检查isLogin状态，判断跳转
  // console.log(localStorage.personalInfo);
  if (localStorage.PersonalInfo) {
    var stoPersonalInfo = JSON.parse(localStorage.PersonalInfo);
    if (stoPersonalInfo.isLogin) {
      angular.extend(PersonalInfo, stoPersonalInfo);
      $location.path('/menu/people-list');
    }
  }

})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider, $httpProvider) {

  $stateProvider

    // 侧边栏
    .state('menu', {
      abstract: true,
      url: '/menu',
      templateUrl: 'templates/menu.html',
      controller: 'SideMenuCtrl'
    })
  ;

  // 暂时默认到室友列表
  // $urlRouterProvider.otherwise('/menu/people-list');

  // 暂时默认到个性问卷
  // $urlRouterProvider.otherwise('/me/q/1');

  $urlRouterProvider.otherwise('/login');

  // 强制让标签栏在底部
  // $ionicConfigProvider.tabs.position('bottom');

  $ionicConfigProvider.navBar.alignTitle('center');

  // 去除标题栏返回按钮的文字
  $ionicConfigProvider.backButton.text('').previousTitleText(false);

  $httpProvider.defaults.withCredentials = true;
  
  // $httpProvider.defaults.useXDomain = true;
});
var ServiceModule=angular.module('global.service',[]);
