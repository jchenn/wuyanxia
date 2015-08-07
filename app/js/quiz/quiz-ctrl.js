angular.module('quiz.ctrl', [])

// 一次性填写个性标签的控制器
.controller('QuizCtrl', 
  function($scope, $ionicSlideBoxDelegate, $ionicLoading, 
    QuizModel, QuizSubmit, PersonalInfo, PersonalInfoMange) {

  var quiz    = QuizModel.quiz;

  // 当前的问卷序号
  $scope.index    = 0;
  $scope.quiz     = quiz;

  // 禁止滑动
  $scope.disableSlide = function() {
    $ionicSlideBoxDelegate.enableSlide(false);
  };

  // 记录问卷答案，并判断是到下一题，还是提交
  $scope.select = function(index, value) {

    // console.log('quiz select', index, value);
    QuizModel.set(index, value);

    if (index === quiz.length - 1) {
      // 最后一题，提交
      finish();
    } else {
      // 到下一题
      next(index);
    }

  };

  $scope.prev = prev;

  // 提交问卷，如果有房，跳转到室友列表，如果没房，跳转到房源问卷
  function finish() {

     // 显示遮罩
    $ionicLoading.show();

    QuizSubmit.submit(QuizModel.get(), function(response) {

      // console.log('quiz submit', QuizModel.get());
      // console.log('quiz response', response);

      if (response.errno === 0) {

        // 修改个人标签
        PersonalInfo.tags = response.tags;
        PersonalInfoMange.update(PersonalInfo);

        if (PersonalInfo.hasHouse) {

          // 对于有房源的用户，直接到室友列表页
          $scope.go('/menu/people-list');
          
        } else {

          // 对于未发布房源的用户，跳转到询问房源的页面
          $scope.go('/quiz/house');

        }

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
  }

  // 到下一题
  function next(current) {
    $ionicSlideBoxDelegate.next();
    $scope.index = current + 1;

    $scope.$broadcast('next', current);
  }

  // 到上一题
  function prev(current) {
    $ionicSlideBoxDelegate.previous();
    $scope.index = current - 1;

    $scope.$broadcast('previous', current);
  }
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

  // 提交问卷
  $scope.select = function(name, value) {

    var answer = {};
    answer[name] = value;

    QuizSubmit.submit(answer, function(response) {

      console.log('quiz update', answer, response);

      if (response.errno === 0) {

        // 修改个人标签
        PersonalInfo.tags = response.tags;
        PersonalInfoMange.update(PersonalInfo);

        $scope.go('/me');

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

  };

})

.controller('QuizHouseCtrl', function($ionicHistory) {
  $ionicHistory.clearHistory();
})
;