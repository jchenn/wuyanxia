angular.module('menu.ctrl', [])

.controller('SideMenuCtrl', function($scope, PersonalInfo) {
  $scope.me = PersonalInfo;

  $scope.$on('load.people.list', function() {
    // console.log('update side menu');
    $scope.me = PersonalInfo;

    console.log(PersonalInfo);
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