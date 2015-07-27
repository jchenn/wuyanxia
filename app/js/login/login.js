angular.module('login', ['login.ctrl'])

.config(function($stateProvider) {

  // 与登录注册相关的视图
  $stateProvider

    // 登录
    .state('login', {
      url: '/login',
      templateUrl: 'templates/login.html'
    });
});