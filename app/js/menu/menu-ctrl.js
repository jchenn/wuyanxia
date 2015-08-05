angular.module('menu.ctrl', [])

.controller('SideMenuCtrl', function($scope, PersonalInfo, PeopleFilterModel) {
  $scope.me = PersonalInfo;

  $scope.$on('load.people.list', function() {
    // console.log('update side menu', PersonalInfo);
    
    $scope.me = PersonalInfo;

    PeopleFilterModel.setUsingCache(false);
  });
})

.controller('SettingCtrl', function($scope, $ionicHistory, PersonalInfoMange) {
  $scope.logout = function() {
    
    // 删除用户信息
    PersonalInfoMange.clear();

    $scope.go('/login');

    // $ionicHistory.clearHistory();
    // $ionicHistory.clearCache();
  }
});
;