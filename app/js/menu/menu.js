angular.module('menu', ['menu.ctrl'])

.config(function($stateProvider) {
  $stateProvider
    .state('menu.about', {
      url: '/about',
      views: {
        'menu-content': {
          templateUrl: 'templates/menu/about.html'
        }
      }
    })

    .state('menu.score', {
      url: '/score',
      views: {
        'menu-content': {
          templateUrl: 'templates/menu/empty.html'
        }
      }
    })

    .state('menu.setting', {
      url: '/setting',
      views: {
        'menu-content': {
          templateUrl: 'templates/menu/setting.html',
          controller: 'SettingCtrl'
        }
      }
    })
})
;