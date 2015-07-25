angular.module('people.service', ['ngResource'])

.factory('PeopleListQuery', function($resource, HTTP_PREFIX) {
  return $resource(
    HTTP_PREFIX + '/people/list',
    {
    }
  );
})

.factory('PeopleDetailQuery', function($resource, HTTP_PREFIX) {
  return $resource(HTTP_PREFIX + '/people/:id');
});