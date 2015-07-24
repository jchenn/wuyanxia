angular.module('people', ['people.ctrl', 'people.service'])

.config(function($stateProvider) {

  // 与室友相关的视图
  $stateProvider
  
    // 室友列表
    .state('tab.people-list', {
      url: '/people',
      views: {
        'people-tab': {
          templateUrl: 'templates/people/people-list.html',
          controller: 'PeopleListCtrl'
        }
      }
    })

    // 室友详情
    .state('tab.people-detail', {
      url: '/people-detail/:id',
      views: {
        'people-tab': {
          templateUrl: 'templates/people/people-detail.html',
          controller: 'PeopleDetailCtrl'
        }
      }
    })
});