angular.module('me.ctrl', [])

// 处理个性问答的控制器
.controller('QuestionCtrl', function($scope, $stateParams, QuestionList) {

  // 问卷序号，从 1 开始
  var id = ~~$stateParams.id;

  $scope.id           = id;
  $scope.nextOrFinish = '下一题';
  $scope.showHint     = false;
  $scope.question     = QuestionList[id - 1];
  $scope.styleLeft    = 16.6667 * id - 16.6667;

  // console.log($scope.question);

  // 对第一题和最后一题的界面做额外处理
  if (id === 1) {

    // 添加第一页做问题的提示
    $scope.showHint = true;

  } else if (id === QuestionList.length) {

    // 修改最后一题的提示按钮
    $scope.nextOrFinish = '完成'

  }

  $scope.next = function() {
    
    // console.log(id);

    if (id >= 1 && id < QuestionList.length) {

      $scope.go('/me/q/' + (id + 1));

    } else {

      // 完成问题，跳转到筛选页面
      $scope.go('/menu/people');

    }
  }

}).controller('InfoRegister', function($scope, $ionicModal,$ionicPopover){
      /*  var me = $scope.me;
        $ionicModal.fromTemplateUrl('sex-modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal){
            $scope.modal = modal;
        });
        //显示modal
        $scope.openSex = function(){
            $scope.modal.show();
        };
        //隐藏modal
        $scope.closeSex = function(){
            $scope.modal.hide();
        };
        //选择性别
        $scope.selectSex = function(sex){
            $scope.selectsex = sex;
            $scope.closeSex();
        };*/

        $ionicPopover.fromTemplateUrl('birth-modal.html', {
            scope: $scope
        }).then(function(popover) {
            $scope.popover = popover;
        });

        $scope.openBirth = function($event) {
            $scope.popover.show($event);
        };
        $scope.closeBirth = function() {
            $scope.popover.hide();
        };
        $scope.selectYear = function(year){
            $scope.year = year;
        };
        $scope.selectMonth = function(month){
            $scope.month = month;
        };
        $scope.selectDay = function(day){
            $scope.day = day;
        }
    })

;