angular.module('menu.ctrl', [])

.controller('SideMenuCtrl', function($scope, PersonalInfo) {
  $scope.me = PersonalInfo;
})

.controller('SettingCtrl', function($scope) {
  $scope.logout = function() {
    // TODO 删除用户信息
    $scope.go('/login');
  }
});
;