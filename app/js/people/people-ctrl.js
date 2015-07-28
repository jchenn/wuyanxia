angular.module('people.ctrl', [])

.controller('PeopleListCtrl', 
  function($scope, $ionicLoading, $ionicScrollDelegate, PeopleListQuery, PeopleFilterModel) {

  $scope.list = [];

  var params = PeopleFilterModel.params();

  $scope.loadMore = function() {

    // 没有更多，不需要更新界面
    if (!PeopleFilterModel.hasMore()) {
      console.log('no more');
      return;
    }

    // 显示 loading 动画
    $ionicLoading.show({
      templateUrl: 'templates/people/people-maching.html'
    });

    // 从服务器加载数据，包括初次加载、加载更多，以及重新筛选
    PeopleListQuery.get(params, function(response) {

      // console.log('request', params);

      var data;

      // console.log(response);

      if (response.errno === 0) {

        var data = response.data;

        if (data.length > 0) {
          // 追加室友列表并更新页数
          if (params.p === 1) {
            $ionicScrollDelegate.scrollTop();
          }
          $scope.list = params.p === 1 ? data : $scope.list.concat(response.data);
          PeopleFilterModel.increasePage();
        } else {
          PeopleFilterModel.setMore(false);
        }

        PeopleFilterModel.setUsingCache(true);
      } else {
        // TODO error handling
      }

      // 关闭 loading 动画
      $ionicLoading.hide();
      $scope.$broadcast('scroll.infiniteScrollComplete');

    }, function(err) {

      console.log('err', err);
      
      $ionicLoading.hide();
      PeopleFilter.setMore(false);
      $scope.$broadcast('scroll.infiniteScrollComplete');
    });
  };

  $scope.$on('$stateChangeSuccess', function(event, toState) {
    if (toState.name === 'menu.people-list' && !PeopleFilterModel.isUsingCache()) {
      $scope.loadMore();
      PeopleFilterModel.setUsingCache(true);
    }
  });

})

.controller('PeopleFilterCtrl', function($scope, $state, PeopleFilterModel) {
  $scope.buttons = PeopleFilterModel.radio;
  $scope.list = PeopleFilterModel.list;
  $scope.params = PeopleFilterModel.params();

  $scope.finish = function() {
    PeopleFilterModel.resetPage();
    PeopleFilterModel.setMore(true);
    PeopleFilterModel.setUsingCache(false);
    $state.go('menu.people-list');
  };

  $scope.back = function() {
    PeopleFilterModel.setUsingCache(true);
    $state.go('menu.people-list');
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