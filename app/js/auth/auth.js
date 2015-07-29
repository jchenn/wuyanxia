angular.module('auth', ['auth.ctrl', 'auth.service'])

.run(function($rootScope){
  var info =  localStorage.PersonalInfo;
  if (info) {
    info = JSON.parse(info);
    if (info.userId) {
      // $rootScope.go('/menu/people-list');
    } 
  } 
})

.config(function($stateProvider) {

  // 与登录注册相关的视图
  $stateProvider

    // 登录
    .state('login', {
      url: '/login',
      templateUrl: 'templates/auth/login.html',
      controller: 'LoginCtrl'
    })
    // 注册
    .state('register', {
      url: '/register',
      templateUrl: 'templates/auth/register.html',
      controller: 'RegisterCtrl'
    });
});