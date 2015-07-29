angular.module('me', ['me.ctrl', 'me.service'])

.config(function($stateProvider) {

  // 个人信息相关页面，包括个人资料设置和标签问卷
  $stateProvider

    // 个人资料
    .state('me', {
      url: '/me',
      templateUrl: 'templates/me/me.html'
    })

    // 填写个人标签（问卷）
    .state('me-q', {
      url: '/me/q/:number',
      params: {number: '1'},
      templateUrl: 'templates/me/q.html',
      controller: 'QuestionCtrl'
    })

    //个人注册信息页面
      .state('me-register', {
          url: '/me-register',
          templateUrl: 'templates/me/register.html'
      })
      //修改个人信息
      .state('me-editor', {
        url: '/me-editor',
        templateUrl: 'templates/me/me-editor.html'
      })
      //手机验证
      .state('phone-validate', {
        url: '/phone-validate',
        templateUrl: 'templates/me/phone-validate.html'
      })
      //身份认证
      .state('id-validate', {
        url: '/id-validate',
        templateUrl: 'templates/me/id-validate.html'
      })
      //邮箱认证
      .state('email-validate', {
        url: '/email-validate',
        templateUrl: 'templates/me/email-validate.html'
      })
  ;
})

.constant('HTTP_PREFIX', 'http://10.242.37.68:4000')

// .constant('HTTP_PREFIX', 'http://223.252.223.13/Roommates/api')

;