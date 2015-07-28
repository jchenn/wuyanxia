angular.module('me', ['me.ctrl', 'me.service'])

.config(function($stateProvider) {

  // 个人信息相关页面，包括个人资料设置和标签问卷
  $stateProvider

    // 个人资料
    .state('menu.me', {
      url: '/me',
      views: {
        'menu-content': {
          templateUrl: 'templates/me/me.html'
        }
      }
    })

    // 填写个人标签（问卷）
    .state('me-q', {
      url: '/me/q/:number',
      params: {number: '1'},
      templateUrl: 'templates/me/q.html',
      controller: 'QuestionCtrl'
    })
  ;
})

.constant('HTTP_PREFIX', 'http://10.242.37.68:4000')
;