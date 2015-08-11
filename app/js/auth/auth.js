angular.module('auth', ['auth.ctrl', 'auth.service', 'auth.filters'])

.config(function($stateProvider) {

  // 与登录注册相关的视图
  $stateProvider

    // 登录
    .state('login', {
      url: '/login',
      cache: false,
      templateUrl: 'templates/auth/login.html',
      controller: 'LoginCtrl'
    })
    // 注册
    .state('register', {
      url: '/register',
      cache: false,
      templateUrl: 'templates/auth/register.html',
      controller: 'RegisterCtrl'
    })
    // 时间选择test
    .state('test', {
      url: '/test',
      templateUrl: 'templates/auth/test.html',
      controller: 'TestCtrl'
    })
     ;
});