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
          controller: 'PeopleFilterCtrl'
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

.constant('PeopleFilterSelect', {
  buttons: [
    {name: 'f', choices: [{label: '有房', value: '2'}, {label: '无房', value: '3'}, {label: '不限', value: '1'}]},
    {name: 'xb', choices: [{label: '男', value: '2'}, {label: '女', value: '3'}, {label: '全部', value: '1'}]}
  ],
  list: [
    {name: 'gs', label: '公司', choices: [
      {label: '网易', value: '2'}, {label: '阿里', value: '3'}, {label: '大华', value: '4'},
      {label: 'UC 斯达康', value: '5'}, {label: '海康威视', value: '6'}
    ]},
    {name: 'cy', label: '抽烟', choices: [{label: '抽烟', value: '2'}, {label: '无所谓', value: '3'}, {label: '讨厌烟味', value: '4'}]},
    {name: 'cw', label: '宠物', choices: [{label: '养宠物', value: '2'}, {label: '喜欢宠物', value: '3'}, {label: '不喜欢', value: '4'}]},
    {name: 'zx', label: '作息', choices: [{label: '夜猫子', value: '2'}, {label: '晨型人', value: '3'}]},
    {name: 'ws', label: '个人卫生', choices: [{label: '小洁癖', value: '2'}, {label: '偶尔打扫', value: '3'}, {label: '无所谓', value: '4'}]},
    {name: 'xg', label: '性格', choices: [{label: '活泼开朗', value: '2'}, {label: '普通', value: '3'}, {label: '沉稳', value: '4'}]},
    {name: 'fk', label: '访客', choices: [{label: '经常', value: '2'}, {label: '偶尔', value: '3'}, {label: '很少', value: '4'}]},
  ]
})

// .constant('HTTP_PREFIX', 'http://192.168.1.105:4000')
.constant('HTTP_PREFIX', 'http://10.242.37.68:4000')

;