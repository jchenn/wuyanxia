angular.module('people.ctrl', [])

.controller('PeopleListCtrl', function($scope, $location, PeopleListQuery) {
  $scope.go = function(hash) {
    // console.log(hash);
    $location.path(hash);
  };

  // TODO：显示遮罩

  PeopleListQuery.get(null, function(response) {

    // TODO: 关闭遮罩

    if (response.errno === 0) {
      $scope.list = response.data;
    }
  }, function(err) {
    console.log(err);
  });
})

.controller('PeopleDetailCtrl', function($scope, $stateParams, PeopleDetailQuery) {

  var id = $stateParams.id;
  console.log(id);

  // TODO: 显示遮罩

  PeopleDetailQuery.get({id: id}, function(response) {
    // TODO: 关闭遮罩
    if (response.errno === 0) {
      $scope.people = response.data;
    }
  }, function(err) {
    console.log(err);
  });
});