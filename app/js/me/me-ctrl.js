angular.module('me.ctrl', [])

// 处理个性问答的控制器
.controller('QuestionCtrl', 
  function($scope, $stateParams, $ionicPopup, $ionicLoading, $http, QuizModel, QuizSubmit) {

  // 问卷序号，从 1 开始
  var number = ~~$stateParams.number,
      quiz   = QuizModel.quiz;

  // console.log(quiz);

  $scope.number       = number;
  $scope.nextOrFinish = '下一题';
  $scope.showHint     = false;
  $scope.question     = quiz[number - 1];
  $scope.styleLeft    = 16.6667 * number - 16.6667;

  // console.log($scope.question);

  // 对第一题和最后一题的界面做额外处理
  if (number === 1) {

    // 添加第一页做问题的提示
    $scope.showHint = true;

  } else if (number === quiz.length) {

    // 修改最后一题的提示按钮
    $scope.nextOrFinish = '完成';

  }

  $scope.next = function() {
    
    // console.log(id);

    if (number >= 1 && number < quiz.length) {

      $scope.go('/me/q/' + (number + 1));

    } else {

      // 完成问题，跳转到筛选页面
      // console.log('完成答题');
      $ionicLoading.show({});

      QuizSubmit.submit(QuizModel.get(), function(response) {
        if (response.errno === 0) {

          $ionicLoading.hide();

          $ionicPopup.alert({
            template: '完成答题'
          }).then(function(res) {
            $scope.go('/menu/people-list');
          });

        }
      }, function(err) {
        console.log('err', err);
      })
    }
  };

  $scope.select = function(name, value) {

    QuizModel.set(name, value);
    // console.log(QuizModel.get());

    // 如果有房源，则要判断是否现在发布
    if (name == 'yf' && value == 2) {

      $ionicPopup.confirm({
        template: '要不要先描述一下房源，为招到合租室友做好准备？',
        okText: '好的',
        cancelText: '一会儿再说'
      }).then(function(res) {
        console.log(res);
        if (res) {
          // TODO: 跳转到发布房源的界面
          $scope.next();
        } else {
          $scope.next();
        }
      });
    } else {
      $scope.next();
    }
  };

})
;