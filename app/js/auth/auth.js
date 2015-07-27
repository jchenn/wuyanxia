angular.module('auth', ['login.ctrl'])

.config(function($stateProvider) {

  // 与登录注册相关的视图
  $stateProvider

    // 登录
    .state('login', {
      url: '/login',
      templateUrl: 'templates/auth/login.html',
      controller: 'PeopleListCtrl'
    })
    // 注册
    .state('register', {
      url: '/register',
      templateUrl: 'templates/auth/register.html',
      controller: 'PeopleListCtrl'
    });
});