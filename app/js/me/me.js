angular.module('me', [])

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
  ;
})
;