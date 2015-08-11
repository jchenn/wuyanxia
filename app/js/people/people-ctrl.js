angular.module('people.ctrl', [])

// 主页：室友列表
.controller('PeopleListCtrl', 
  function($scope, $timeout, $ionicLoading, $ionicScrollDelegate, $ionicPopup, $ionicHistory,
    PeopleListQuery, PeopleFilterModel, PersonalInfo, PermissionChecker) {

  var _hasMore  = true,
      _fetching = false,
      params    = PeopleFilterModel.params(),
      _data;

  $scope.list     = [];
  $scope.showHint = false;
  
  $scope.hasMore = function() {
    return _fetching ? false : _hasMore;
  }

  // 加载更多
  $scope.loadMore = function() {

    // console.log('load more', $scope.list, _hasMore, _fetching);

    _fetching = true;

    // 显示 loading 动画
    $ionicLoading.show({
      templateUrl: 'templates/people/people-maching.html'
    });

    // 从服务器加载数据，包括初次加载、加载更多，以及重新筛选
    PeopleListQuery.get(params, function(response) {

      // console.log('request', params);
      // console.log('response', response);

      if (response.errno === 0) {

        _data = response.data || [];

        if (params.p === 1) {
          $scope.list = _data;
        }

        if (_data.length > 0) {
          $scope.list = (params.p === 1) ? _data : $scope.list.concat(_data);
        }

        if (_data.length < PeopleFilterModel.SIZE) {
          _hasMore = false;
        } else {
          _hasMore = true;
        }

        // console.log('length', $scope.list.length);
        PeopleFilterModel.increasePage();
        PeopleFilterModel.setUsingCache(true);

        // $scope.$broadcast('remove');
      } else {
        // TODO error handling
      }

      // 关闭 loading 动画
      $ionicLoading.hide();

      if ($scope.list.length > 0) {
        $scope.showHint = false;
      } else {
        $scope.showHint = true;
      }

      $timeout(function() {
        _fetching = false;
        $scope.$broadcast('scroll.infiniteScrollComplete');

        // TODO 不确定是否能解决下拉到底部不能继续滑动的问题
        // $ionicScrollDelegate.resize();
      }, 500);

    }, function(err) {

      console.log('list err', err);
      
      $ionicLoading.hide();
      _hasMore = false;
      _fetching = false;
      $scope.$broadcast('scroll.infiniteScrollComplete');
    });
  };

  // 下拉刷新
  $scope.doRefresh = function() {

    // 当下拉刷新失败时不会影响原条件
    var tmpfilter = angular.copy(params);

    tmpfilter.p = 1;

    PeopleListQuery.get(tmpfilter, function(response) {

      // console.log('request', params);

      if (response.errno === 0) {

        _data = response.data || [];

        if (_data.length > 0) {
          $scope.list = _data;
        }

        if (_data.length < PeopleFilterModel.SIZE) {
          _hasMore = false;
        } else {
          _hasMore = true;
        }

        // 成功后，之后的加载从第二页开始
        params.p = 2;
        PeopleFilterModel.setUsingCache(true);
      } else {
        // TODO error handling
      }

      if ($scope.list.length > 0) {
        $scope.showHint = false;
      } else {
        $scope.showHint = true;
      }

      $scope.$broadcast('scroll.refreshComplete');

    }, function(err) {

      console.log('refresh err', err);
      
      _hasMore = false;
      $scope.$broadcast('scroll.refreshComplete');
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

  $scope.$on('$destroy', function() {
    console.log('[destroy] PeopleListCtrl');
    $scope.list = null;
  });

  // 在跳转到室友详情之前，先判断是否填完个人信息
  $scope.jumpToDetail = PermissionChecker.goto;
  // $scope.jumpToDetail = function(p) {
  //   PermissionChecker.goto('/menu/people-list/' + p.userId + '/' + (p.hasHouse ? '1' : ''));
  // };
})

.controller('PeopleFilterCtrl', function($scope, PeopleFilterModel) {
  $scope.buttons = PeopleFilterModel.radio;
  $scope.list = PeopleFilterModel.list;
  $scope.params = PeopleFilterModel.params();

  // console.log('params', $scope.params);

  $scope.finish = function() {
    PeopleFilterModel.setUsingCache(false);
    $scope.go('/menu/people-list');
  };

  $scope.back = function() {
    PeopleFilterModel.setUsingCache(true);
    $scope.go('/menu/people-list');
  };
})

.controller('PeopleDetailCtrl', 
  function($scope, $ionicActionSheet, $stateParams, $ionicLoading, $ionicPopup, $ionicSlideBoxDelegate, $ionicModal,
    $timeout, PeopleDetailQuery, FavAdd, FavRemove, ForbidAdd, PersonalInfo) {

  $scope.isShowInfo = true;
  $scope.isShowHouse = false;
  $scope.isShowTab = $stateParams.hasHouse ? true : false;

  $ionicLoading.show();

  // console.log('detail', $stateParams);

  PeopleDetailQuery.get({id: $stateParams.id}, function(response) {
    
    // console.log('detail', response);
    
    if (response.errno === 0) {
        
      $scope.people = response.data;
      $scope.house  = response.data.matchUserHouse;
      
      // 设置默认照片
      if ($scope.house && !$scope.house.images) {
        $scope.house.images = ['img/placeholder-house.png'];
      }
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
    $scope.isShowInfo  = false;
    $scope.isShowHouse = true;
    $scope.isShowPager = $scope.house && $scope.house.images && $scope.house.images.length > 1;

    $timeout(function() {
      $ionicSlideBoxDelegate.$getByHandle('image-viewer').update();
    },1000);

  };

  $ionicModal.fromTemplateUrl('image-modal.html', {
    scope: $scope,
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.openModal = function(index) {
    // console.log(index);
    $ionicSlideBoxDelegate.$getByHandle('full-image-viewer').slide(index);
    $scope.modal.show();
  };

  $scope.closeModal = function() {
    $scope.modal.hide();
  };  

  $scope.showImage = function(index) {
    $scope.openModal(index);
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

  //Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    console.log('[destroy] PeopleDetailCtrl');
    $scope.modal.remove();
  });

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

  $scope.showHint = false;

  FavQuery.get({userId: PersonalInfo.userId}, function(response) {
    // console.log('fav list', response);

    if (response.errno === 0) {
      $scope.list = response.data || [];
    }

    $scope.showHint = $scope.list.length === 0 ? true : false;

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
    $ionicLoading.show();

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

          _data = response.data || [];

          if (_p === 1) {
            $scope.list = [];
          }

          if (_data.length > 0) {
            $scope.list = $scope.list.concat(_data);
            _hasMore = true;
          }

          if (_data.length < PeopleFilterModel.SIZE) {
            _hasMore = false;
          } else {
            _hasMore = true;
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