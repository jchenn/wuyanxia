angular.module('people', ['people.ctrl', 'people.service'])

.config(function($stateProvider) {

  // 与室友相关的视图
  $stateProvider
  
    // 室友列表
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
      views: {
        'menu-content': {
          // templateUrl: 'templates/people/people-detail.html',
          templateUrl: 'templates/people/people-detail-wrapper.html',
          controller: 'PeopleDetailWrapperCtrl'
        }
      }
    })

    // 室友详情页
    .state('menu.people-detail.info', {
      url: '/info',
      views: {
        'people-detail-nav': {
          templateUrl: 'templates/people/people-detail-nav.html'
        },
        'people-detail': {
          templateUrl: 'templates/people/people-detail-info.html',
          controller: 'PeopleDetailInfoCtrl'
        }
      }
    })

    // 房源详情页
    .state('menu.people-detail.house', {
      url: '/house',
      views: {
        'people-detail': {
          templateUrl: 'templates/people/people-detail-house.html',
          controller: 'PeopleDetailHouseCtrl'
        }
      }
    })
    ;
})

.directive('peopleDetailNav', function() {
  return {
    restrict: 'E',
    templateUrl: 'templates/people/people-detail-nav.html'
  }
})

// .constant('HTTP_PREFIX', 'http://192.168.1.105:4000')
.constant('HTTP_PREFIX', 'http://10.242.37.68:4000')

;