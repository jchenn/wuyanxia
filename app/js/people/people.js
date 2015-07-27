angular.module('people', ['people.ctrl', 'people.service'])

.config(function($stateProvider) {

  // 与室友相关的视图
  $stateProvider
  
    // 室友列表
    .state('menu.people-list', {
      url: '/people-list',
      views: {
        'menu-content': {
          templateUrl: 'templates/people/people-list.html',
          controller: 'PeopleListCtrl'
        }
      }
    })

    // 筛选
    .state('menu.people-filter', {
      url: '/people-filter',
      views: {
        'menu-content': {
          templateUrl: 'templates/people/people-filter.html',
          controller: 'PeopleListCtrl'
        }
      }
    })

    // 室友详情
    .state('menu.people-detail', {
      url: '/people-detail/:id',
      views: {
        'menu-content': {
          templateUrl: 'templates/people/people-detail.html',
          controller: 'PeopleDetailCtrl'
        }
      }
    });
})

.constant('HTTP_PREFIX', 'http://192.168.1.105:4000')
//.constant('HTTP_PREFIX', 'http://10.242.37.68:4000')

;