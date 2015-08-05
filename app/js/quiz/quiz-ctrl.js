angular.module('quiz.ctrl', [])

// 一次性填写个性标签的控制器
.controller('QuizCtrl', function() {

})

// 修改个性问答的控制器
.controller('QuizEditCtrl', 
  function($scope, $stateParams, $ionicPopup, $ionicLoading, $ionicHistory,
    QuizModel, QuizSubmit, PersonalInfo, PersonalInfoMange) {

  // 问卷序号，从 1 开始
  var name    = $stateParams.name,
      quiz    = QuizModel.quiz,
      index;

  // 计算当前问卷的序号，以及题目内容
  for (index = 0; index < quiz.length; ++index) {
    if (quiz[index].name === name) {

      $scope.number       = index + 1;
      $scope.quiz         = quiz[index];
      $scope.styleLeft    = 20 * index;

      // console.log('quiz', $scope.quiz);
      break;
    }
  }

  // 处理是否显示返回按钮的逻辑
  if (PersonalInfo.tags) {
    // 修改个人标签，显示返回，不显示跳过
    $scope.showBack = true;
  } else {
    // 回答问卷
    if (index === 0) {
      // 第一题，显示跳过，不显示返回
      $scope.showBack = false;
      $ionicHistory.clearHistory();
    } else {
      // 后续题目，显示返回，不显示跳过
      $scope.showBack = true;
    }
  }

  // 处理是否显示第一题的 hint 的逻辑
  $scope.showHint = (!PersonalInfo.tags && index === 0) ? true : false;

  // 处理是否显示进度条
  $scope.showProgress = PersonalInfo.tags ? false : true;

  // 记录问卷答案，并判断是到下一题，还是提交
  $scope.select = function(name, value) {

    QuizModel.set(name, value);

    // console.log(QuizModel.get());

    checkFinish();

  };

  // 如果是修改问卷，就返回到之前的页面
  // 如果是第一次做问卷，就到下一题，如果是最后一题，就到室友列表
  function checkFinish() {

    // console.log('PersonalInfo', PersonalInfo);

    // 存在个人标签表示是修改问卷，或者到最后一题，两种情况都需要提交问卷
    if (PersonalInfo.tags || index === quiz.length - 1) {

       // 显示遮罩
      $ionicLoading.show();

      QuizSubmit.submit(QuizModel.get(), function(response) {

        console.log('quiz submit', QuizModel.get());
        console.log('quiz response', response);

        if (response.errno === 0) {

          if (PersonalInfo.tags) {
            
            // 修改个人标签，到个人信息页
            $scope.go('/me');

          } else if (PersonalInfo.hasHouse) {

            // 对于有房源的用户，可以到室友列表页，而不用做第7题
            $scope.go('/menu/people-list');
            
          } else {

            // 由注册时引导填写的问卷，
            // 或者是权限限制跳转过来，
            // 都跳转到询问房源的页面
            $scope.go('/quiz/house');

          }

          // 修改个人标签
          PersonalInfo.tags = response.tags;
          PersonalInfoMange.update(PersonalInfo);

        } else {

          // 服务端错误，到室友列表
          $scope.go('/menu/people-list');

        }

        // 提交成功后关闭 loading 动画
        $ionicLoading.hide();

      }, function(err) {

        // 网络错误，提交失败也要关闭 loading 动画
        console.log('quiz err', err);
        $ionicLoading.hide();
        
      });

    } else if (index >= 0 && index < quiz.length - 1) {

      // 还有下一题
      $scope.go('/quiz/' + quiz[index + 1].name);

    }
  }
})

.controller('QuizHouseCtrl', function($ionicHistory) {
  $ionicHistory.clearHistory();
})
;