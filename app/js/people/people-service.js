angular.module('people.service', ['ngResource'])

.factory('PeopleListQuery', function($resource, HTTP_PREFIX) {
  return $resource(
    HTTP_PREFIX + '/people/list?p=:p&xb=:xb&f=:f&gs=:gs&cy=:cy&cw=:cw&zx=:zx&ws=:ws&xg=:xg&fk=:fk',
    {
      p:  1, // 页数 
      xb: 1, // 性别
      f:  1, // 是否有房
      gs: 1, // 公司
      cy: 1, // 抽烟
      cw: 1, // 宠物
      zx: 1, // 作息
      ws: 1, // 个人卫生
      xg: 1, // 性格
      fk: 1  // 访客
    }
  );
})

.factory('PeopleFilter', function() {
  var params = {}, prev = '';

  return {
    get: function(key) {
      return key ? params.key : params;
    },
    set: function(key, value) {
      // console.log(params);
      prev = JSON.stringify(params);
      if (typeof key === 'object') {
        params = key;
      } else {
        params.key = value;
      }
      // console.log(params);
    },
    clear: function() {
      prev = JSON.stringify(params);
      params = {};
    },
    changed: function() {
      return prev != JSON.stringify(params);
    }
  }
})

.factory('PeopleDetailQuery', function($resource, HTTP_PREFIX) {
  return $resource(HTTP_PREFIX + '/people/:id');
})

.factory('PeopleMark', function($resource, HTTP_PREFIX) {

  // POST, :id, :token
  return $resource(HTTP_PREFIX + '/people/mark');
})

.factory('PeopleForbid', function($resource, HTTP_PREFIX) {

  // POST, :id, :token
  return $resource(HTTP_PREFIX + '/people/forbid');
})
;