angular.module('house.directive', [])

.directive('wHouseFilter', function(AreaList, PriceList, RoomList) {
  // console.log('AreaList', AreaList);
  return {
    restrict: 'E',
    templateUrl: 'directive-house-filter.html',
    controller: function($scope) {
      $scope.areaList = AreaList;
      $scope.priceList = PriceList;
      $scope.roomList = RoomList;

      $scope.showArea = false;
      $scope.showPrice = false;
      $scope.showRoom = false;
    }
  };
});