angular.module('people.ctrl', [])

.controller('PeopleListCtrl', function($scope, PeopleListQuery) {
  
  // TODO：显示遮罩

  // TODO 添加参数
  PeopleListQuery.get(null, function(response) {

    // TODO: 关闭遮罩

    if (response.errno === 0) {
      $scope.list = response.data;
    }
  }, function(err) {
    console.log(err);
  });



})

.controller('PeopleDetailCtrl', function($scope, $ionicActionSheet, $stateParams, PeopleDetailQuery) {

  // TODO: 显示遮罩

  PeopleDetailQuery.get({id: $stateParams.id}, function(response) {
    // TODO: 关闭遮罩
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