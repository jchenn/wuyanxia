angular.module('people.service', ['ngResource'])

.factory('PeopleListQuery', function($resource, PeopleFilterModel) {
  var resource = $resource(
    // 'http://10.242.37.68:4000/people/list?' 
    'http://223.252.223.13/Roommates/api/people/list?' 
    + 'id=:id&p=:p&xb=:xb&f=:f&gs=:gs&cy=:cy&cw=:cw&zx=:zx&ws=:ws&xg=:xg&fk=:fk',
    PeopleFilterModel.getDefaultChoice());

  return resource;
})

.factory('PeopleSearchQuery', function($resource) {
    return $resource('http://223.252.223.13/Roommates/api/people/search?id=:id&q=:q&p=:p');
})

.factory('PeopleFilterModel', function(PersonalInfo) {
  var condition = {
    buttons: [
      {name: 'f', choices: [{label: '有房', value: '2'}, {label: '无房', value: '3'}, {label: '不限', value: '1'}]},
      {name: 'xb', choices: [{label: '男', value: '2'}, {label: '女', value: '3'}, {label: '全部', value: '1'}]}
    ],
    list: [
      {name: 'gs', label: '公司', choices: [
        {label: '不限', value: '1'}, {label: '网易', value: '2'}, {label: '阿里', value: '3'},
        {label: '大华', value: '4'}, {label: 'UT斯达康', value: '5'}, {label: '海康威视', value: '6'}
      ]},
      {name: 'cy', label: '抽烟', choices: [
        {label: '不限', value: '1'}, {label: '抽烟', value: '2'}, 
        {label: '无所谓', value: '3'}, {label: '讨厌烟味', value: '4'}
      ]},
      {name: 'cw', label: '宠物', choices: [
        {label: '不限', value: '1'}, {label: '养宠物', value: '2'}, 
        {label: '喜欢宠物', value: '3'}, {label: '不喜欢', value: '4'}
      ]},
      {name: 'zx', label: '作息', choices: [
        {label: '不限', value: '1'}, {label: '夜猫子', value: '2'}, 
        {label: '早睡狗', value: '3'}
      ]},
      {name: 'ws', label: '个人卫生', choices: [
        {label: '不限', value: '1'}, {label: '小洁癖', value: '2'}, 
        {label: '偶尔打扫', value: '3'}, {label: '无所谓', value: '4'}
      ]},
      {name: 'xg', label: '性格', choices: [
        {label: '不限', value: '1'}, {label: '活泼开朗', value: '2'}, 
        {label: '普通', value: '3'}, {label: '沉稳', value: '4'}
      ]},
      {name: 'fk', label: '访客', choices: [
        {label: '不限', value: '1'}, {label: '经常', value: '2'}, 
        {label: '偶尔', value: '3'}, {label: '很少', value: '4'}
      ]}
    ]
  };

  var DefaultChoice = {
    p: 1, f: 1, xb: 1, gs: 1, cy: 1, cw: 1, zx: 1, ws: 1, xg: 1, fk: 1
  };

  var _choice       = angular.copy(DefaultChoice),
      _isUsingCache = true;

  var factory = {
    radio: condition.buttons,
    list: condition.list,
    getDefaultChoice: function() {
      return angular.copy(DefaultChoice);
    },
    params: function() {
      _choice.id = PersonalInfo.userId;
      return _choice;
    },
    resetPage: function() {
      _choice.p = 1;
    },
    increasePage: function() {
      ++_choice.p;
    },
    setUsingCache: function(isUsingCache) {
      _isUsingCache = isUsingCache;

      if (!_isUsingCache) {
        factory.resetPage();
      }
    },
    isUsingCache: function() {
      return _isUsingCache;
    },
    resetFilter: function() {
      _choice = angular.copy(DefaultChoice);
    }
  };

  return factory;
})

.factory('PeopleDetailQuery', function($resource) {
  return $resource('http://223.252.223.13/Roommates/api/people/detail/:id');
})

.factory('FavQuery', function($resource) {
  return $resource('http://223.252.223.13/Roommates/api/people/fav?userId=:userId', null, {
    // get: {
    //   method: 'GET',
    //   transformResponse: function(response) {
    //     console.log('transform', response);
    //     return response;
    //   },
    //   withCredentials: true
    // }
  });
})

.factory('FavAdd', function($resource) {

  // POST, userId, favId
  return $resource('http://223.252.223.13/Roommates/api/people/fav');
})

.factory('FavRemove', function($resource) {

  // POST, userId, favId
  return $resource('http://223.252.223.13/Roommates/api/people/fav/del');
})

.factory('ForbidAdd', function($resource) {

  // POST, userId, forbidId
  return $resource('http://223.252.223.13/Roommates/api/people/forbid');
})

.factory('PermissionChecker', function(PersonalInfo, $ionicPopup, $rootScope) {
  var factory = {
    goto: function(hash) {
      
      if (PersonalInfo.completeInfo && PersonalInfo.tags) {

        // 有个性标签，有个人信息
        $rootScope.go(hash);

      } else if (!PersonalInfo.tags && !PersonalInfo.completeInfo) {

        // 无个性标签，无个人信息
        $ionicPopup.confirm({
          template: '只有填写自己的个人信息和匹配问题才能为您匹配室友，并查看详情信息哟。',
          okText: '现在填写',
          cancelText: '稍后再说'
        }).then(function(res) {
          if (res) {
            $rootScope.go('/menu/me-register');
          } else {
            // do nothing
          }
        });

      } else if (!PersonalInfo.completeInfo) {

        // 有个性标签，无个人信息
        $ionicPopup.confirm({
          template: '只有填写自己的个人信息才能看到室友的详情信息哟。',
          okText: '现在填写',
          cancelText: '稍后再说'
        }).then(function(res) {
          if (res) {
            $rootScope.go('/menu/me-register');
          } else {
            // do nothing
          }
        });

      } else if (!PersonalInfo.tags) {

        // 无个人信息，有个性标签
        $ionicPopup.confirm({
          template: '请回答以下6个问题，以便为您更精确匹配室友。',
          okText: '现在回答',
          cancelText: '稍后再说'
        }).then(function(res) {
          if (res) {
            $rootScope.go('/quiz');
          } else {
            // do nothing
          }
        });

      } // 结束4种判断
    }
  };

  return factory;
})
;