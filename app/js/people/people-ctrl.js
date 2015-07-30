angular.module('people.ctrl', [])

.controller('PeopleListCtrl', 
  function($scope, $ionicLoading, $ionicScrollDelegate, $ionicPopup,
    PeopleListQuery, PeopleFilterModel, PersonalInfo) {
  
  $scope.$emit('load.people.list');

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
        PeopleFilterModel.setMore(true);
      }

      // 关闭 loading 动画
      $ionicLoading.hide();
      $scope.$broadcast('scroll.infiniteScrollComplete');

    }, function(err) {

      console.log('err', err);
      
      $ionicLoading.hide();
      PeopleFilterModel.setMore(false);
      $scope.$broadcast('scroll.infiniteScrollComplete');
    });
  };

  $scope.$on('$stateChangeSuccess', function(event, toState) {
    if (toState.name === 'menu.people-list' && !PeopleFilterModel.isUsingCache()) {
      $scope.loadMore();
      PeopleFilterModel.setUsingCache(true);
    }
  });

  // 在跳转到室友详情之前，先判断是否填完个人信息
  $scope.jumpToDetail = function(hash) {

    // console.log(PersonalInfo);
    // PersonalInfo.completeInfo = false;
    // PersonalInfo.completeAsk = true;

    // TODO 判断是否完成问卷
    if (PersonalInfo.completeInfo && PersonalInfo.completeAsk) {
      $scope.go(hash);
    } else if (!PersonalInfo.completeAsk && !PersonalInfo.completeInfo) {
      $ionicPopup.confirm({
        template: '只有填写自己的个人信息和匹配问题才能为您匹配室友，并查看详情信息哟。',
        okText: '现在填写',
        cancelText: '稍后再说'
      }).then(function(res) {
        if (res) {
          $scope.go('/me');
        } else {
          // do nothing
        }
      });
    } else if (!PersonalInfo.completeInfo) {
      $ionicPopup.confirm({
        template: '只有填写自己的个人信息才能看到室友的详情信息哟。',
        okText: '现在填写',
        cancelText: '稍后再说'
      }).then(function(res) {
        if (res) {
          $scope.go('/me');
        } else {
          // do nothing
        }
      });
    } else if (!PersonalInfo.completeAsk) {
      $ionicPopup.confirm({
        template: '请回答以下7个问题，以便为您更精确匹配室友。',
        okText: '现在回答',
        cancelText: '稍后再说'
      }).then(function(res) {
        if (res) {
          $scope.go('/me/q/1');
        } else {
          // do nothing
        }
      });
    }
  };

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

.controller('PeopleDetailWrapperCtrl', function($scope, $ionicActionSheet, $stateParams, PeopleDetailQuery) {

  PeopleDetailQuery.get({id: $stateParams.id}, function(response) {
    console.log(response);
    
    if (response.errno === 0) {
      $scope.people = response.data;
      $scope.house = $scope.people.house;
      // console.log($scope.house);
    }
  }, function(err) {
    console.log('error', err);
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
})

.controller('PeopleDetailInfoCtrl', function($scope) {
  $scope.showInfo = true;
  console.log($scope.people);
})

.controller('PeopleDetailHouseCtrl', function($scope) {
  $scope.showHouse = true;
  $scope.log($scope.house);
})
;