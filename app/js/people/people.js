angular.module('people', ['people.ctrl', 'people.service', 'people.directive'])

.config(function($stateProvider) {

  // 与室友相关的视图
  $stateProvider
  
    // 室友列表，点详情后需要返回，所以必须缓存
    .state('menu.people-list', {
      url: '/people-list',
      // cache: false,
      views: {
        'menu-content': {
          templateUrl: 'templates/people/people-list.html',
          controller: 'PeopleListCtrl'
        }
      }
    })

    // 室友搜索页，点详情后需要返回，所以必须缓存
    .state('menu.people-search', {
      url: '/search',
      // cache: false,
      views: {
        'menu-content': {
          templateUrl: 'templates/people/people-search.html',
          controller: 'PeopleSearchCtrl'
        }
      }
    })

    // 筛选
    .state('menu.people-filter', {
      url: '/people-filter',
      views: {
        'menu-content': {
          templateUrl: 'templates/people/people-filter.html',
          controller: 'PeopleFilterCtrl'
        }
      }
    })

    // 室友详情页外围容器
    .state('menu.people-detail', {
      url: '/people-detail/:id',
      abstract: true,
      cache: false,
      views: {
        'menu-content': {
          templateUrl: 'templates/people/people-detail-wrapper.html',
          controller: 'PeopleDetailWrapperCtrl'
        }
      }
    })

    // 室友详情页
    .state('menu.people-detail.info', {
      url: '/info',
      cache: false,
      views: {
        'people-detail-nav': {
          templateUrl: 'templates/people/people-detail-nav.html'
        },
        'people-detail': {
          cache: false,
          templateUrl: 'templates/people/people-detail-info.html',
          controller: 'PeopleDetailInfoCtrl'
        }
      }
    })

    // 房源详情页
    .state('menu.people-detail.house', {
      url: '/house',
      cache: false,
      views: {
        'people-detail-nav': {
          templateUrl: 'templates/people/people-detail-nav.html'
        },
        'people-detail': {
          cache: false,
          templateUrl: 'templates/people/people-detail-house.html',
          controller: 'PeopleDetailHouseCtrl'
        }
      }
    })
    ;
})

.filter('nickname', function() {
  return function(input) {
    return input && input.length > 4 ? input.substring(0, 4) + '...' : input;
  }
})
;