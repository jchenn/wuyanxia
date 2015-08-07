angular.module('people.ctrl', [])

// 主页：室友列表
.controller('PeopleListCtrl', 
  function($scope, $ionicLoading, $ionicScrollDelegate, $ionicPopup, $ionicHistory,
    PeopleListQuery, PeopleFilterModel, PersonalInfo, PermissionChecker) {

  var _hasMore  = true,
      _fetching = false,
      params    = PeopleFilterModel.params(),
      _data;

  $scope.list = [];
  
  $scope.hasMore = function() {
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

      // console.log('request', params);

      // console.log(response);

      if (response.errno === 0) {

        _data = response.data;

        if (params.p === 1) {
          $scope.list = [];
        }

        if (_data && _data.length > 0) {
          $scope.list = $scope.list.concat(_data);
          _hasMore = true;
        } else {
          // console.log('no more');
          _hasMore = false;
        }

        PeopleFilterModel.increasePage();
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

      console.log('list err', err);
      
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

        // 登录后更新侧边栏
        $scope.$emit('load.people.list');

        // 将缓存置为无效
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
  $scope.jumpToDetail = PermissionChecker.goto;
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

.controller('PeopleDetailCtrl', 
  function($scope, $ionicActionSheet, $stateParams, $ionicLoading, $ionicPopup,
    PeopleDetailQuery, FavAdd, FavRemove, ForbidAdd, PersonalInfo) {

  $scope.isShowInfo = true;
  $scope.isShowHouse = false;
  $scope.isShowTab = $stateParams.hasHouse ? true : false;

  $ionicLoading.show({
    templateUrl: 'templates/people/people-maching.html'
  });

  PeopleDetailQuery.get({id: $stateParams.id}, function(response) {
    
    // console.log('detail', response);
    
    if (response.errno === 0) {
      $scope.people = response.data;
      $scope.house = $scope.people.matchUserHouse;
      // console.log($scope.house);
    }

    $ionicLoading.hide();

  }, function(err) {
    // TODO 无法查看室友详情，提示错误信息
    console.log('detail error', err);
    $ionicLoading.hide();
  });

  $scope.showInfo = function() {
    $scope.isShowInfo = true;
    $scope.isShowHouse = false;
  };

  $scope.showHouse = function() {
    $scope.isShowInfo = false;
    $scope.isShowHouse = true;
  };

  // 显示 收藏/屏幕 菜单
  $scope.showMenu = function() {

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

    // console.log('handle forbid');

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
                // console.log('forbid success');
              }
            }, 
            function(err) {
              console.log('forbid err', err);
            }
          );
        } else {
          // do nothing
        }
      });
  }
})

.controller('FavCtrl', function($scope, PersonalInfo, FavQuery) {

  FavQuery.get({userId: PersonalInfo.userId}, function(response) {
    // console.log('fav list', response);

    if (response.errno === 0) {
      $scope.list = response.data;
    }
  }, function(err) {
    console.log('fav list err', err);
  });

  // 可以直接查看详情，不需要其他权限
  $scope.jumpToDetail = $scope.go;
})

.controller('PeopleSearchCtrl', 
  function($scope, $ionicLoading, PersonalInfo, PeopleSearchQuery, PermissionChecker) {

  var _fetching   = false,
      _hasMore    = false,
      _p          = 1,
      _data;

  $scope.list = [];
  $scope.q = '';
  $scope.showHint = false;

  // 触发搜索
  $scope.search = function() {
    // console.log('key words', $scope.q);

    if ($scope.q.trim()) {
      _p = 1;
      $scope.loadMore();
    }

  };

  // 判断是否需要加载更多
  $scope.hasMore = function() {
    return _fetching ? false : _hasMore;
  };

  $scope.loadMore = function() {

    // 显示 loading 动画
    $ionicLoading.show({
      templateUrl: 'templates/people/people-maching.html'
    });

    _fetching = true;

    PeopleSearchQuery.get(
      {
        id: PersonalInfo.userId,
        q:  $scope.q,
        p:  _p
      },
      function(response) {

        // console.log('search response', response);

        if (response.errno === 0) {

          _data = response.data;

          if (_p === 1) {
            $scope.list = [];
          }

          if (_data && _data.length > 0) {
            $scope.list = $scope.list.concat(_data);
            _hasMore = true;
          } else {
            _hasMore = false;
          }
        } else {
          // TODO catched err
        }

        ++_p;
        _fetching = false;
        $ionicLoading.hide();
        $scope.$broadcast('scroll.infiniteScrollComplete');

        if ($scope.list.length === 0) {
          $scope.showHint = true;
        } else {
          $scope.showHint = false;
        }
      },
      function(err) {
        // console.log('search err', err);
        _hasMore = false;
        _fetching = false;
        $ionicLoading.hide();
        $scope.$broadcast('scroll.infiniteScrollComplete');
      }
    );
  };

  $scope.jumpToDetail = PermissionChecker.goto;
})
;