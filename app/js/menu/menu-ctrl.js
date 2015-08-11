angular.module('menu.ctrl', [])

.controller('SideMenuCtrl', function($scope, PersonalInfo, PeopleFilterModel, event) {

  // bind data
  $scope.me = PersonalInfo;

  $scope.$on('load.people.list', function() {
    // console.log('update side menu', PersonalInfo);
    
    // 更新侧边栏
    $scope.me = PersonalInfo;

  });

  $scope.editInfo = function() {
    if (PersonalInfo.completeInfo) {
      $scope.go('/menu/me');
    } else {
      $scope.go('/menu/me-register');
      event.trigger('me.initData');
    }
  };

  $scope.editHouse = function() {
    event.trigger('house.init');
  };
})

.factory('LogoutSubmit', function($resource) {
  return $resource('http://223.252.223.13/Roommates/api/logout');
})

.controller('SettingCtrl', function($scope, $window, $ionicHistory, 
  PersonalInfoMange, LogoutSubmit, Data, PeopleFilterModel) {

  // console.log('setting');

  $scope.logout = function() {

    LogoutSubmit.save({
      access_token: $window.localStorage.access_token
    }, function(response) {
      doLogout();
    }, function(err) {
      doLogout();
    });

    function doLogout() {
      // 删除用户信息
      PersonalInfoMange.clear();

      // 删除 access_token
      $window.localStorage.removeItem('access_token');

      // 维伟同学需要删
      Data.clear();

      // 重置筛选条件
      PeopleFilterModel.resetFilter();

      $scope.go('/login');

      // $ionicHistory.clearHistory();
      // $ionicHistory.clearCache();
    }
  }
})

.constant('Faq', [
  {
    q: '1. 信用等级是怎么评的，有什么用？',
    a: '<p>目前信用等级主要取决于用户的个人身份验证的完整度，绑定“手机号”、“身份证”、“企业邮箱”的用户会得到最高的信用等级，信用等级依用户绑定的数量由多至少而递减。</p>' +
       '<p>较高的信用等级不仅有利于提升自己邀请合租的成功率，也有利于收到更多来自他人的合租邀请。</p>'
  },
  {
    q: '2. 你们这个匹配准不准，你们怎么匹配的？',
    a: '<p>我们的匹配算法是基于用户填写的个人信息及个性问答后生成的用户标签，再按照一定的数据及优先级得出的匹配值，为用户优先推送匹配率高的室友。所以为了提高匹配的准确度，请用户认真填写个人资料。</p>'
  },
  {
    q: '3. 那个问卷有六道题，我不想做？',
    a: '<p>在个人信息填写过程中我们设置了“跳过”按钮，用户可以选择“跳过”直接来到室友页面，但是只能看到其他用户的照片而没有详细信息，只有填写自己的个人信息和问卷，才能看到匹配室友的详细信息。</p>'
  }
])

.controller('FaqCtrl', function($scope, Faq) {
  $scope.list = Faq;
})

.factory('FeedbackSubmit', function($resource) {
  return $resource('http://223.252.223.13/Roommates/api/feedback');
})

.controller('FeedbackCtrl', 
  function($scope, $timeout, $ionicLoading, FeedbackSubmit, $ionicPopup, PersonalInfo) {

  $scope.body = {content: ''};

  $scope.send = function() {
    // console.log($scope.body);

    if ($scope.body.content.trim().length > 0) {
      FeedbackSubmit.save(
        {
          userId: PersonalInfo.userId,
          body: $scope.body.content
        },
        function(response) {
          // 发送成功，清空反馈信息的事情在定时后自动完成
          // $scope.body.content = '';
        },
        function(err) {
          console.log('feedback err', err);
        }
      );

      $ionicLoading.show();
      $timeout(function() {
        $ionicLoading.hide();
        $ionicPopup.alert({
          template: '发送成功',
          okText:'确定'
        });
        $scope.body.content = '';
      }, 1500);
    }
  };
})
;