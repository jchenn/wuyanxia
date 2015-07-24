angular.module('house.ctrl', [])

.controller('HouseListCtrl', function($scope, $location, HouseQuery) {

  $scope.go = function(hash) {
    // console.log(hash);
    $location.path(hash);
  };

  HouseQuery.get(null, function(result) {
    if (result.errno === 0) {
      $scope.list = result.data;
    }
  }, function(err) {
    console.log('err', err);
  });
})

.controller('HouseDetailCtrl', function($scope, $stateParams, HouseDetailQuery) {
  // console.log($stateParams.id);
  HouseDetailQuery.get({id: $stateParams.id}, function(result) {
    if (result.errno === 0) {
      $scope.house = result.data;
    }
  }, function(err) {
    console.log(err);
  });
});

