angular.module('people.ctrl', [])

.controller('PeopleListCtrl', 
  function($scope, $ionicLoading, PeopleListQuery, PeopleFilter) {

  $scope.list = [];

  $scope.loadMore = function() {

    if (!PeopleFilter.hasChanged()) {
      $scope.$broadcast('scroll.infiniteScrollComplete');
      return;
    }

    PeopleFilter.setChanged(false);
    
    var params = PeopleFilter.get();
    
    console.log('more', params);

    // 显示 loading 动画
    $ionicLoading.show({
      templateUrl: 'templates/people/people-maching.html'
    });

    PeopleListQuery.get(params, function(response) {

      // console.log(response);

      if (response.errno === 0) {

        // 追加室友列表并更新页数
        $scope.list = $scope.list.concat(response.data);
        PeopleFilter.increase();
        PeopleFilter.setChanged(true);
        
      }

      // 关闭 loading 动画
      $ionicLoading.hide();
      $scope.$broadcast('scroll.infiniteScrollComplete');

    }, function(err) {

      console.log('err', err);
      
      $ionicLoading.hide();
      PeopleFilter.setChanged(true);
      // $scope.$broadcast('scroll.infiniteScrollComplete');
    });
  };

})

.controller('PeopleFilterCtrl', function($scope, $state, PeopleFilterModel, PeopleFilter) {
  $scope.buttons = PeopleFilterModel.buttons;
  $scope.list = PeopleFilterModel.list;
  $scope.params = {f: 1, xb: 1, gs: 1, cy: 1, cw: 1, zx: 1, ws: 1, xg: 1, fk: 1};

  $scope.finish = function() {
    console.log($scope.params);
    PeopleFilter.setChanged(true);

    // TODO: 判断是否需要重新请求数据
    $state.go('menu.people-list', null, {reload: true});
    // $scope.go('/menu/people-list?r=1');
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