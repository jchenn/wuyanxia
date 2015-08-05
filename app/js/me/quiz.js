angular.module('quiz', [])

.config(function($stateProvider) {

  $stateProvider

    // 问卷提示页
    .state('quiz-hint', {
      url: '/quiz/hint',
      cache: false,
      templateUrl: 'templates/me/quiz-hint.html',
      controller: 'QuizCtrl'
    })

    // 询问是否有房
    .state('quiz-house', {
      url: '/quiz/house',
      cache: false,
      templateUrl: 'templates/me/quiz-house.html',
      controller: 'QuizCtrl'
    })

    // 填写个人标签（问卷）
    .state('quiz', {
      url: '/quiz/:name',
      cache: false,
      templateUrl: 'templates/me/quiz.html',
      controller: 'QuizCtrl'
    })
  ;
})

// 处理个性问答的控制器
.controller('QuizCtrl', 
  function($scope, $stateParams, $ionicPopup, $ionicLoading, 
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

      console.log('quiz', $scope.quiz);
      break;
    }
  }

  // 到第一题
  $scope.startQuiz = function() {
    QuizModel.setByHint(true);
    $scope.go('/quiz/' + quiz[0].name);
  };

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

    // 存在个人标签，表示是修改问卷
    if (PersonalInfo.tags || index === quiz.length - 1) {

       // 提交
      $ionicLoading.show();

      QuizSubmit.submit(QuizModel.get(), function(response) {

        console.log('quiz response', response);

        if (response.errno === 0) {

          if (PersonalInfo.tags) {
            // 修改个人标签，到个人信息页
            $scope.go('/me');
          } else {
            if (QuizModel.byHint()) {
              // 由注册时引导填写的问卷，跳转到询问房源的页面
              $scope.go('/quiz/house');
            } else {
              // 由权限限制跳转过来，答完题后跳转到室友列表
              $scope.go('/menu/people-list');
            }
          }

          // TODO 修改个人标签
          PersonalInfo.tags = response.tags;
          PersonalInfoMange.update(PersonalInfo);
        } else {

          // 服务端错误，到室友列表
          $scope.go('/menu/people-list');

        }

        // 提交成功后关闭 loading 动画
        $ionicLoading.hide();

      }, function(err) {

        // 提交失败也要关闭 loading 动画
        console.log('quiz err', err);
        $ionicLoading.hide();
        
      });

    } else if (index >= 0 && index < quiz.length - 1) {

      // 还有下一题
      $scope.go('/quiz/' + quiz[index + 1].name);

    }
  }
})

;