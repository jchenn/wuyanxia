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

})
;