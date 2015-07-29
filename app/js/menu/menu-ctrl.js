angular.module('menu.ctrl', [])

.controller('SideMenuCtrl', function($scope, PersonalInfo) {
  $scope.me = PersonalInfo;
})

.controller('SettingCtrl', function($scope) {
  
})
;