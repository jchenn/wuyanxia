angular.module('people.ctrl', [])

// 主页：室友列表
.controller('PeopleListCtrl', 
  function($scope, $ionicLoading, $ionicScrollDelegate, $ionicPopup, $ionicHistory,
    PeopleListQuery, PeopleFilterModel, PersonalInfo) {

  var _hasMore = true,
      _fetching = false,
      params = PeopleFilterModel.params(),
      data = null;

  $scope.$emit('load.people.list');

  $scope.list = [];
  
  $scope.hasMore = function() {
    // console.log('fetching, more', _fetching, _hasMore);
    return _fetching ? false : _hasMore;
  }

  $scope.loadMore = function() {

    _fetching = true;

    // 显示 loading 动画
    $ionicLoading.show({
      templateUrl: 'templates/people/people-maching.html'
    });

    // 从服务器加载数据，包括初次加载、加载更多，以及重新筛选
    PeopleListQuery.get(params, function(response) {

      console.log('request', params);

      // console.log(response);

      if (response.errno === 0) {

        data = response.data;

        if (data.length > 0) {

          // 追加室友列表并更新页数
          if (params.p === 1) {
            $scope.list = data;
            $ionicScrollDelegate.scrollTop();
          } else {
            $scope.list = $scope.list.concat(data);
          }

          PeopleFilterModel.increasePage();

        } else {
          // console.log('no more');
          _hasMore = false;
        }

        PeopleFilterModel.setUsingCache(true);
      } else {
        // TODO error handling
        _hasMore = true;
      }

      // 关闭 loading 动画
      $ionicLoading.hide();
      _fetching = false;
      $scope.$broadcast('scroll.infiniteScrollComplete');

    }, function(err) {

      console.log('err', err);
      
      $ionicLoading.hide();
      _hasMore = false;
      _fetching = false;
      $scope.$broadcast('scroll.infiniteScrollComplete');
    });
  };

  // 当切换到室友列表时，需要判断是使用已有数据还是从数据库重新加载
  $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState) {
    if (toState.name === 'menu.people-list') {

      if (fromState.name === 'login') {
        PeopleFilterModel.setUsingCache(false);
      }

      if (!PeopleFilterModel.isUsingCache()) {
        $scope.loadMore();
      }

      // console.log('clear history');
      $ionicHistory.clearHistory();
      $ionicHistory.clearCache();
    }
  });

  // 在跳转到室友详情之前，先判断是否填完个人信息
  $scope.jumpToDetail = function(hash) {

    // $scope.go(hash);
    // return;

    // 判断是否完成问卷
    if (PersonalInfo.completeInfo && PersonalInfo.tags) {
      $scope.go(hash);
    } else if (!PersonalInfo.tags && !PersonalInfo.completeInfo) {
      $ionicPopup.confirm({
        template: '只有填写自己的个人信息和匹配问题才能为您匹配室友，并查看详情信息哟。',
        okText: '现在填写',
        cancelText: '稍后再说'
      }).then(function(res) {
        if (res) {
          $scope.go('/me-register');
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
          $scope.go('/me-register');
        } else {
          // do nothing
        }
      });
    } else if (!PersonalInfo.tags) {
      $ionicPopup.confirm({
        template: '请回答以下6个问题，以便为您更精确匹配室友。',
        okText: '现在回答',
        cancelText: '稍后再说'
      }).then(function(res) {
        if (res) {
          $scope.go('/quiz/zx');
        } else {
          // do nothing
        }
      });
    }
  };
})

.controller('PeopleFilterCtrl', function($scope, PeopleFilterModel) {
  $scope.buttons = PeopleFilterModel.radio;
  $scope.list = PeopleFilterModel.list;
  $scope.params = PeopleFilterModel.params();

  $scope.finish = function() {
    PeopleFilterModel.setMore(true);
    PeopleFilterModel.setUsingCache(false);
    $scope.go('/menu/people-list');
  };

  $scope.back = function() {
    PeopleFilterModel.setUsingCache(true);
    $scope.go('/menu/people-list');
  };
})

.controller('PeopleDetailWrapperCtrl', 
  function($scope, $ionicActionSheet, $stateParams, PersonalInfo, $ionicPopup,
    PeopleDetailQuery, FavAdd, FavRemove, ForbidAdd) {

  PeopleDetailQuery.get({id: $stateParams.id}, function(response) {
    
    console.log('detail', response);
    
    if (response.errno === 0) {
      $scope.people = response.data;
      $scope.house = $scope.people.matchUserHouse;
      // console.log($scope.house);
    }
  }, function(err) {
    // TODO 无法查看室友详情，提示错误信息
    console.log('detail error', err);
  });

  // 显示 收藏/屏幕 菜单
  $scope.showMenu = function() {

    console.log('people', $scope.people);

    // 返回一个关闭菜单的函数
    $ionicActionSheet.show({
      buttons: [
        { text: $scope.people.isFav ? '取消收藏' : '收藏' },
        { text: '不喜欢' }
      ],
      cancelText: '取消',
      buttonClicked: function(index) {
        index ? handleForbid() : handleFav();
        return true;
      }
    });
  };

  // 处理添加收藏或者取消收藏
  function handleFav() {

    console.log('handle fav');

    if ($scope.people.isFav) {

      // 取消收藏
      FavRemove.save(
        {
          userId: PersonalInfo.userId, 
          favId: $scope.people.userId
        }, 
        function(response) {
          if (response.errno === 0) {
            $scope.people.isFav = false;
          }
        }, 
        function(err) {
          console.log('unfav err', err);
        }
      );

    } else {

      // 添加收藏
      FavAdd.save(
        {
          userId: PersonalInfo.userId, 
          favId: $scope.people.userId
        }, 
        function(response) {
          if (response.errno === 0) {
            $scope.people.isFav = true;
          }
        }, 
        function(err) {
          console.log('fav err', err);
        }
      );
    }
  }

  function handleForbid() {

    // TODO 增加一个提示框 处理屏蔽
    console.log('handle forbid');

    $ionicPopup.confirm(
      {
        template: '点击不喜欢，你将不会再看到该室友信息了哟。',
        okText: '不喜欢',
        cancelText: '我再想想'
      })
      .then(function(res) {
        if (res) {
          ForbidAdd.save(
            {
              userId: PersonalInfo.userId, 
              forbidId: $scope.people.userId
            },
            function(response) {
              if (response.errno === 0) {
                console.log('forbid success');
              }
            }, 
            function(err) {
              console.log('err', err);
            }
          );
        } else {
          // do nothing
        }
      });
  }
})

.controller('PeopleDetailInfoCtrl', function($scope) {
  $scope.showInfo = true;
  // console.log($scope.people);
})

.controller('PeopleDetailHouseCtrl', function($scope) {
  $scope.showHouse = true;
  // console.log($scope.house);
})

.controller('FavCtrl', function($scope, PersonalInfo, FavQuery) {

  FavQuery.get({userId: PersonalInfo.userId}, function(response) {
    console.log('fav list', response);

    if (response.errno === 0) {
      $scope.list = response.data;
    }
  }, function(err) {
    console.log('err', err);
  });

  // 可以直接查看详情，不需要其他权限
  $scope.jumpToDetail = $scope.go;
})
;