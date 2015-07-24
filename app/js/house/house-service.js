angular.module('house.service', ['ngResource'])

.factory('HouseQuery', function(HTTP_PREFIX, $resource) {
  // console.log('factory');

  return $resource(
    HTTP_PREFIX + '/house/list?q=:q&p=:p&area=:area&price=:price&room=:room',
    {
      q: '',
      p: '1',
      area: '滨江',
      price: '1',
      room: '1'
    }
  );
})

.factory('HouseDetailQuery', function(HTTP_PREFIX, $resource) {
  return $resource(HTTP_PREFIX + '/house/:id');
});