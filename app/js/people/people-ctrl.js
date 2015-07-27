angular.module('people.ctrl', [])

.controller('PeopleListCtrl', function($scope, $ionicLoading, PeopleListQuery) {

  // 显示 loading 动画
  $ionicLoading.show({
    templateUrl: 'templates/people/people-maching.html'
  });

  // TODO 添加参数
  PeopleListQuery.get(null, function(response) {

    // 关闭 loading 动画
    // console.log(response);
    $ionicLoading.hide();

    if (response.errno === 0) {
      $scope.list = response.data;
    }

  }, function(err) {
    // console.log(err);
    $ionicLoading.hide();
  });

})

.controller('PeopleFilterCtrl', function($scope, PeopleFilterSelect, $ionicActionSheet2) {
  $scope.buttons = PeopleFilterSelect.buttons;
  $scope.list = PeopleFilterSelect.list;

  $scope.select = function(name, value) {
    // 
  };

  $scope.finish = function() {
    //
    $ionicActionSheet2.show({
      buttons: [
        {text: 'xx'}
      ],
      buttonClicked: function(index) {
        // TODO: 实现
        return true;
      }
    });
  };
})

.controller('PeopleDetailCtrl', function($scope, $ionicActionSheet, $stateParams, PeopleDetailQuery) {

  PeopleDetailQuery.get({id: $stateParams.id}, function(response) {
    if (response.errno === 0) {
      $scope.people = response.data;
    }
  }, function(err) {
    console.log(err);
  });

  $scope.showMenu = function() {

    // 返回一个关闭菜单的函数
    $ionicActionSheet.show({
      buttons: [
        { text: '收藏' },
        { text: '不喜欢' }
      ],
      cancelText: '取消',
      buttonClicked: function(index) {
        // TODO: 实现
        return true;
      }
    });
  }

});