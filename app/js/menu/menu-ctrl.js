angular.module('menu.ctrl', [])

.controller('SideMenuCtrl', function($scope, PersonalInfo, PeopleFilterModel) {
  $scope.me = PersonalInfo;

  $scope.$on('load.people.list', function() {
    console.log('update side menu', PersonalInfo);
    
    $scope.me = PersonalInfo;

    PeopleFilterModel.setUsingCache(false);
  });
})

.controller('SettingCtrl', function($scope) {
  $scope.logout = function() {
    // 删除用户信息
    localStorage.removeItem('PersonalInfo');
    $scope.go('/login');
  }
});
;