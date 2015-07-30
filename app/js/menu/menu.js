angular.module('menu', ['menu.ctrl'])

.config(function($stateProvider) {
  $stateProvider

    .state('menu.fav', {
      url: '/fav',
      cache: false,
      views: {
        'menu-content': {
          templateUrl: 'templates/people/fav-list.html',
          controller: 'FavCtrl'
        }
      }
    })
    
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

    .state('menu.faq', {
      url: '/faq',
      views: {
        'menu-content': {
          templateUrl: 'templates/menu/empty.html'
        }
      }
    })

    .state('menu.feedback', {
      url: '/feedback',
      views: {
        'menu-content': {
          templateUrl: 'templates/menu/empty.html'
        }
      }
    })
})

.filter('lookStatus', function() {
  var lookStatusMap = ['正在寻找', '已找到']
  return function(lookStatusNo) {
    // console.log(lookStatusNo);
    return lookStatusMap[lookStatusNo];
  }
})
;