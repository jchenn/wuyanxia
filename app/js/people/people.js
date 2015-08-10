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
      cache: false,
      views: {
        'menu-content': {
          templateUrl: 'templates/people/people-filter.html',
          controller: 'PeopleFilterCtrl'
        }
      }
    })

    // 室友详情页
    .state('menu.people-detail', {
      url: '/people-detail/:id/:hasHouse',
      cache: false,
      views: {
        'menu-content': {
          templateUrl: 'templates/people/people-detail.html',
          controller: 'PeopleDetailCtrl'
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

.filter('smsbody', function(PersonalInfo) {
  return function(people) {

    if (!people) return '';

    if (people.hasHouse) {
      var house = people.matchUserHouse;

      return people.nickName + 
        '你好，我是' + PersonalInfo.nickName + 
        '，有幸在“屋檐下”APP匹配到你，对你和你发布的房源“' + 
        house.title + '”都很感兴趣，希望能详细聊一下。'
    }

    return people.nickName +
      '你好，我是' + PersonalInfo.nickName + 
      '，有幸在“屋檐下”APP匹配到你，感觉我们做室友会很合适，希望能详细聊一下。'
  }
})
;