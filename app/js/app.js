angular.module('wuyanxia', ['ionic', 'menu', 'house', 'people', 'me', 'auth', 'global.service', 'global.directive'])

.run(function($rootScope, $location, $ionicPlatform, $window, PersonalInfo) {
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
    $location.path(hash);
  };
  
  // 检查isLogin状态，判断跳转
  // console.log(localStorage.personalInfo);
  // if (localStorage.PersonalInfo) {
  //   var stoPersonalInfo = JSON.parse(localStorage.PersonalInfo);
  //   if (stoPersonalInfo.isLogin) {
  //     angular.extend(PersonalInfo, stoPersonalInfo);
  //     $location.path('/menu/people-list');
  //   }
  // }

  if ($window.localStorage.access_token) {
    // 自动登录
    // console.log('token', $window.localStorage.access_token);
    angular.extend(PersonalInfo, JSON.parse($window.localStorage.PersonalInfo));
    $rootScope.go('/menu/people-list');
  } else {
    // 到登录界面
    console.log('no token');
    $rootScope.go('/login');
  }

})

.factory('authInterceptor', function ($rootScope, $q, $window) {
  return {
    request: function (config) {
      // console.log(config);
      config.headers = config.headers || {};
      if ($window.localStorage.access_token) {
        // config.headers.Authorization = 'Bearer ' + $window.localStorage.access_token;
        config.headers.Authorization = $window.localStorage.access_token;
      }
      return config;
    },
    responseError: function (response) {
      // console.log('intercept error response', response.status);
      if (response.status === 401 || response.status === 403) {
      // if (response.status === 0) {
        
        // 用户无权限时跳转到登录页
        // 跳到登录界面太霸道了，所以把下面的语句注释掉
        $rootScope.go('/login');
      }

      return $q.reject(response);
    }
  };
})

.config(
  function($stateProvider, $urlRouterProvider, $ionicConfigProvider, $httpProvider, $compileProvider) {

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

  $urlRouterProvider.otherwise('/login');

  // 强制让标签栏在底部
  // $ionicConfigProvider.tabs.position('bottom');

  $ionicConfigProvider.navBar.alignTitle('center');

  // 去除标题栏返回按钮的文字
  $ionicConfigProvider.backButton.text('').previousTitleText(false);

  // TODO 使用 token-based 之后就删掉这个
  // $httpProvider.defaults.withCredentials = true;

  $httpProvider.interceptors.push('authInterceptor');
  
  $ionicConfigProvider.views.transition('none');

  // 防止 angular 在 sms、tel、mailto 协议之前加上 unsafe 前缀
  $compileProvider.aHrefSanitizationWhitelist(/^\s*(sms|tel|mailto|http):|#/);
});

var ServiceModule = angular.module('global.service',[]);
var DirectiveMod = angular.module('global.directive',[]);
